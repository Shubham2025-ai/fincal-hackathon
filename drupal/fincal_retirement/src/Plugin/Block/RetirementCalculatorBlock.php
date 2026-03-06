<?php

declare(strict_types=1);

namespace Drupal\fincal_retirement\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Block\Attribute\Block;
use Drupal\Core\StringTranslation\TranslatableMarkup;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Drupal\Core\Config\ConfigFactoryInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Provides the FinCal Retirement Calculator block.
 *
 * Renders the Next.js calculator as a responsive iframe.
 * Place this block on any page via Structure > Block layout.
 *
 * @Block(
 *   id = "fincal_retirement_calculator",
 *   admin_label = @Translation("FinCal Retirement Calculator"),
 *   category = @Translation("FinCal")
 * )
 */
#[Block(
  id: 'fincal_retirement_calculator',
  admin_label: new TranslatableMarkup('FinCal Retirement Calculator'),
  category: new TranslatableMarkup('FinCal'),
)]
class RetirementCalculatorBlock extends BlockBase implements ContainerFactoryPluginInterface {

  /**
   * Config factory.
   *
   * @var \Drupal\Core\Config\ConfigFactoryInterface
   */
  protected ConfigFactoryInterface $configFactory;

  /**
   * {@inheritdoc}
   */
  public function __construct(
    array $configuration,
    string $plugin_id,
    mixed $plugin_definition,
    ConfigFactoryInterface $config_factory
  ) {
    parent::__construct($configuration, $plugin_id, $plugin_definition);
    $this->configFactory = $config_factory;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(
    ContainerInterface $container,
    array $configuration,
    string $plugin_id,
    mixed $plugin_definition
  ): static {
    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $container->get('config.factory')
    );
  }

  /**
   * {@inheritdoc}
   */
  public function build(): array {
    $config  = $this->configFactory->get('fincal_retirement.settings');
    $baseUrl = rtrim($config->get('nextjs_base_url') ?? 'http://localhost:3000', '/');

    return [
      '#type'     => 'html_tag',
      '#tag'      => 'div',
      '#attributes' => [
        'class'               => ['fincal-retirement-calculator-wrapper'],
        'data-calculator-url' => $baseUrl,
      ],
      'iframe' => [
        '#type'       => 'html_tag',
        '#tag'        => 'iframe',
        '#attributes' => [
          'src'             => $baseUrl,
          'title'           => $this->t('FinCal Retirement Planning Calculator'),
          'width'           => '100%',
          // Height managed via postMessage from Next.js app
          'height'          => '800',
          'frameborder'     => '0',
          'scrolling'       => 'no',
          'loading'         => 'lazy',
          // Security: allow only necessary features
          'allow'           => 'clipboard-write',
          'referrerpolicy'  => 'strict-origin-when-cross-origin',
          'style'           => 'border:none; width:100%; min-height:600px;',
        ],
      ],
      // Inline script to auto-resize iframe via postMessage
      'resize_script' => [
        '#type'       => 'html_tag',
        '#tag'        => 'script',
        '#value'      => $this->getResizeScript(),
        '#attributes' => ['type' => 'text/javascript'],
      ],
      '#attached' => [
        'library' => ['fincal_retirement/calculator'],
      ],
    ];
  }

  /**
   * Returns the iframe auto-resize postMessage script.
   *
   * The Next.js app posts { type: 'fincal-resize', height: N } when its
   * content height changes, allowing Drupal to resize the iframe seamlessly.
   */
  protected function getResizeScript(): string {
    return <<<JS
(function() {
  window.addEventListener('message', function(event) {
    if (!event.data || event.data.type !== 'fincal-resize') return;
    var iframes = document.querySelectorAll('.fincal-retirement-calculator-wrapper iframe');
    iframes.forEach(function(iframe) {
      if (event.source === iframe.contentWindow) {
        iframe.style.height = (event.data.height + 40) + 'px';
      }
    });
  }, false);
})();
JS;
  }

}
