<?php

class App
{
  protected
    $controller = "Home",
    $method = "index",
    $args = [];

  public function __construct()
  {
    $url = $this->parseUrl();

    if (file_exists(__DIR__ . "/../controllers/" .  ucfirst(strtolower($url[0])) . ".php")) {
      $this->controller =  ucfirst(strtolower($url[0]));
      unset($url[0]);
    }

    require_once __DIR__ . "/../controllers/" . $this->controller . ".php";

    $this->controller = new $this->controller;

    if (isset($url[1]) && method_exists($this->controller, $url[1])) {
      $this->method = $url[1];
      unset($url[1]);
    }

    if (!empty($url)) $this->args = array_values($url);

    call_user_func_array([$this->controller, $this->method], $this->args);
  }

  public function parseUrl(): string | array
  {
    if (isset($_GET["url"])) {
      $normalizedUrl = rtrim($_GET["url"], "/");
      $sanitizedUrl = filter_var($normalizedUrl, FILTER_SANITIZE_URL);
      $urlParts = explode("/", $sanitizedUrl);
      return $urlParts;
    }
    return [$this->controller, $this->method];
  }
}
