<?php

class Database
{
  private $db_host = DB_HOST;
  private $db_user = DB_USER;
  private $db_pass = DB_PASS;
  private $db_charset = DB_CHARSET;

  private $db_name;
  private $db_table;

  private $pdo;
  private $stmt;

  public function __construct(string $db_name, string $db_table)
  {
    $this->db_name = $db_name;
    $this->db_table = $db_table;
    $dsn = "mysql:host={$this->db_host};dbname={$this->db_name};charset={$this->db_charset}";

    $options = [
      PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
      PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
      PDO::ATTR_EMULATE_PREPARES => false
    ];

    try {
      $this->pdo =  new PDO($dsn, $this->db_user, $this->db_pass, $options);
    } catch (PDOException $error) {
      die("PDO Errors: " . $error->getMessage());
    }
  }

  public function prepareStmt(string $command): void
  {
    $sqlString = $this->setSqlString($command);
    $this->stmt = $this->pdo->prepare($sqlString);
  }

  public function bindStmt(string $param, mixed $value, ?int $type = null): void
  {
    if (is_null($type)) {
      $type = match (true) {
        is_int($value) => PDO::PARAM_INT,
        is_bool($value) => PDO::PARAM_BOOL,
        is_bool($value) => PDO::PARAM_NULL,
        default => PDO::PARAM_STR
      };
    }

    $this->stmt->bindValue($param, $value, $type);
  }

  public function resultSet(int $option = 0): array
  {
    $this->stmt->execute();
    return $this->stmt->fetchAll($option);
  }

  public function single($option = 0): array|false
  {
    $this->stmt->execute();
    return $this->stmt->fetch($option);
  }

  public function affectedRow(): int
  {
    $this->stmt->execute();
    return $this->stmt->rowCount();
  }

  public function fetchAllData(): array
  {
    $this->prepareStmt("fetch");
    return $this->resultSet();
  }

  public function getPrimaryKey(): array
  {
    $this->prepareStmt("describe");
    $data = $this->resultSet();
    $primaryKey = [];
    foreach ($data as $row) {
      if ($row["Key"] == "PRI") {
        $field = $row["Field"];
        $primaryKey[] = $field;
      }
    }
    return $primaryKey;
  }

  public function getFields(): array
  {
    $this->prepareStmt("describe");
    return $this->resultSet(PDO::FETCH_COLUMN);
  }

  public function getCrudResult(string $command, array $inputData)
  {
    $this->prepareStmt($command);

    foreach ($inputData as $param => $value) {
      $this->bindStmt($param, $value);
    }

    switch ($command) {
      case "search":
        return $this->resultSet();
      case "select":
        return $this->single();
      default:
        return $this->affectedRow();
    }
  }

  public function setSqlString(string $command): string
  {
    $hasParams = !(in_array($command, ["fetch", "describe"], true));
    if ($hasParams) {
      extract(Utils::getSprintfParams($command, $this->getFields(), $this->getPrimaryKey()));
    }
    switch ($command) {
      case "insert":
        return sprintf("INSERT INTO `%s` (%s) VALUES (%s)", $this->db_table, $escapeFields, $placeholders);
      case "update":
        return sprintf("UPDATE `%s` SET %s WHERE %s", $this->db_table, $setClause, $whereAndClause);
      case "delete":
        return sprintf("DELETE FROM `%s` WHERE %s", $this->db_table, $whereAndClause);
      case "select":
        return sprintf("SELECT * FROM `%s` WHERE %s", $this->db_table, $whereAndClause);
      case "search":
        return sprintf("SELECT * FROM `%s` WHERE %s", $this->db_table, $whereOrClause);
      case "fetch":
        return sprintf("SELECT * FROM `%s`", $this->db_table);
      case "describe":
        return sprintf("DESCRIBE `%s`", $this->db_table);
      default:
        throw new InvalidArgumentException($command . " command is not found\n[ " . __FUNCTION__ . " ]");
    }
  }
}
