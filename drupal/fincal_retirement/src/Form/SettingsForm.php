<?php

declare(strict_types=1);

namespace Drupal\fincal_retirement\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\fincal_retirement\FinCalRetirementClient;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Administration form for FinCal Retirement Calculator settings.
 *
 * Access at: /admin/config/fincal/retirement
 */
class SettingsForm extends ConfigFormBase {

  /**
   * FinCal API client.
   *
   * @var \Drupal\fincal_retirement\FinCalRetirementClient
   */
  protected FinCalRetirementClient $finCalClient;

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container): static {
    $instance = parent::create($container);
    $instance->finCalClient = $container->get('fincal_retirement.client');
    return $instance;
  }

  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames(): array {
    return ['fincal_retirement.settings'];
  }

  /**
   * {@inheritdoc}
   */
  public function getFormId(): string {
    return 'fincal_retirement_settings';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state): array {
    $config  = $this->config('fincal_retirement.settings');
    $baseUrl = $config->get('nextjs_base_url') ?? 'http://localhost:3000';
    $healthy = $this->finCalClient->isHealthy();

    $form['connection'] = [
      '#type'  => 'details',
      '#title' => $this->t('Next.js Service Connection'),
      '#open'  => TRUE,
    ];

    $form['connection']['nextjs_base_url'] = [
      '#type'          => 'url',
      '#title'         => $this->t('Next.js Base URL'),
      '#description'   => $this->t(
        'The base URL of the running FinCal Next.js application. '
        . 'E.g. <code>http://localhost:3000</code> or <code>https://fincal.yourdomain.com</code>.'
      ),
      '#default_value' => $baseUrl,
      '#required'      => TRUE,
    ];

    // Live health status indicator
    $form['connection']['health_status'] = [
      '#type'   => 'item',
      '#title'  => $this->t('Service Status'),
      '#markup' => $healthy
        ? '<span style="color:green;font-weight:bold;">✓ Connected</span>'
        : '<span style="color:red;font-weight:bold;">✗ Unreachable — check the URL and ensure the Next.js server is running.</span>',
    ];

    return parent::buildForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state): void {
    $this->config('fincal_retirement.settings')
      ->set('nextjs_base_url', rtrim($form_state->getValue('nextjs_base_url'), '/'))
      ->save();
    parent::submitForm($form, $form_state);
  }

}
