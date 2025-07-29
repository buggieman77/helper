<?php

class Controller
{
  public function view(string $filename, array $data = []): void
  {

    if (isset($data["header"])) {
      require_once __DIR__ . "/../views/templates/header.php";
      return;
    }

    if (isset($data["no_template"])) {
      require_once __DIR__ . "/../views/" . $filename . ".php";
      return;
    }

    if (isset($data["footer"])) {
      require_once __DIR__ . "/../views/templates/footer.php";
      return;
    }

    require_once __DIR__ . "/../views/templates/header.php";
    require_once __DIR__ . "/../views/" . $filename . ".php";
    require_once __DIR__ . "/../views/templates/footer.php";
  }

  public function model(string $filename): object
  {
    require_once __DIR__ . "/../models/" . $filename . ".php";
    return new $filename;
  }
}
