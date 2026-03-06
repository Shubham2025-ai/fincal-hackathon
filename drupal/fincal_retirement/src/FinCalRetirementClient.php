<?php

declare(strict_types=1);

namespace Drupal\fincal_retirement;

use GuzzleHttp\ClientInterface;
use GuzzleHttp\Exception\RequestException;
use Drupal\Core\Config\ConfigFactoryInterface;
use Psr\Log\LoggerInterface;

/**
 * HTTP client for the FinCal Retirement Calculator Next.js API.
 *
 * Usage (in any Drupal service or controller):
 * @code
 *   $client = \Drupal::service('fincal_retirement.client');
 *
 *   $result = $client->calculate([
 *     'currentAge'            => 28,
 *     'retirementAge'         => 60,
 *     'lifeExpectancy'        => 85,
 *     'currentAnnualExpenses' => 600000,
 *     'inflationRate'         => 6,
 *     'preRetirementReturn'   => 12,
 *     'postRetirementReturn'  => 7,
 *     'stepUpRate'            => 10,  // 0 for flat SIP
 *   ]);
 *
 *   if ($result['success']) {
 *     $sip    = $result['results']['requiredMonthlySIP'];
 *     $corpus = $result['results']['retirementCorpus'];
 *   }
 * @endcode
 */
class FinCalRetirementClient {

  /**
   * Guzzle HTTP client.
   *
   * @var \GuzzleHttp\ClientInterface
   */
  protected ClientInterface $httpClient;

  /**
   * Config factory.
   *
   * @var \Drupal\Core\Config\ConfigFactoryInterface
   */
  protected ConfigFactoryInterface $configFactory;

  /**
   * Logger.
   *
   * @var \Psr\Log\LoggerInterface
   */
  protected LoggerInterface $logger;

  /**
   * Constructs a FinCalRetirementClient.
   */
  public function __construct(
    ClientInterface $http_client,
    ConfigFactoryInterface $config_factory,
    $logger_factory
  ) {
    $this->httpClient    = $http_client;
    $this->configFactory = $config_factory;
    $this->logger        = $logger_factory->get('fincal_retirement');
  }

  /**
   * Returns the Next.js base URL from config.
   */
  protected function getBaseUrl(): string {
    $config = $this->configFactory->get('fincal_retirement.settings');
    return rtrim($config->get('nextjs_base_url') ?? 'http://localhost:3000', '/');
  }

  /**
   * Pings the health endpoint to check the Next.js service is reachable.
   *
   * @return bool TRUE if the service is healthy.
   */
  public function isHealthy(): bool {
    try {
      $response = $this->httpClient->get($this->getBaseUrl() . '/api/health', [
        'timeout' => 5,
        'headers' => ['Accept' => 'application/json'],
      ]);
      $body = json_decode((string) $response->getBody(), TRUE);
      return ($body['status'] ?? '') === 'ok';
    }
    catch (\Exception $e) {
      $this->logger->warning('FinCal health check failed: @msg', ['@msg' => $e->getMessage()]);
      return FALSE;
    }
  }

  /**
   * Calls POST /api/calculate and returns the decoded response array.
   *
   * @param array $params
   *   Calculation parameters. Required keys:
   *   - currentAge (int)
   *   - retirementAge (int)
   *   - lifeExpectancy (int)
   *   - currentAnnualExpenses (float)
   *   - inflationRate (float)
   *   - preRetirementReturn (float)
   *   - postRetirementReturn (float)
   *   Optional keys:
   *   - stepUpRate (float, default 0 = flat SIP)
   *
   * @return array
   *   Decoded JSON response. Check ['success'] before using ['results'].
   *
   * @throws \InvalidArgumentException
   *   If required params are missing.
   * @throws \RuntimeException
   *   If the HTTP request fails.
   */
  public function calculate(array $params): array {
    // Ensure defaults.
    $params += ['stepUpRate' => 0];

    // Basic client-side presence check (full validation is server-side).
    $required = [
      'currentAge', 'retirementAge', 'lifeExpectancy',
      'currentAnnualExpenses', 'inflationRate',
      'preRetirementReturn', 'postRetirementReturn',
    ];
    foreach ($required as $key) {
      if (!isset($params[$key])) {
        throw new \InvalidArgumentException("Missing required parameter: {$key}");
      }
    }

    try {
      $response = $this->httpClient->post(
        $this->getBaseUrl() . '/api/calculate',
        [
          'json'    => $params,
          'timeout' => 10,
          'headers' => [
            'Accept'       => 'application/json',
            'Content-Type' => 'application/json',
          ],
        ]
      );

      $body = json_decode((string) $response->getBody(), TRUE);

      if (json_last_error() !== JSON_ERROR_NONE) {
        throw new \RuntimeException('Invalid JSON response from FinCal API.');
      }

      return $body;
    }
    catch (RequestException $e) {
      // Parse error body if available (400 validation errors).
      if ($e->hasResponse()) {
        $errorBody = json_decode((string) $e->getResponse()->getBody(), TRUE);
        if (is_array($errorBody)) {
          return $errorBody;
        }
      }
      $this->logger->error('FinCal API request failed: @msg', ['@msg' => $e->getMessage()]);
      throw new \RuntimeException('FinCal API request failed: ' . $e->getMessage(), 0, $e);
    }
  }

}
