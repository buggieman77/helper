<?php
class Utils
{
  public static function slugify($text): string
  {
    // Transliterate
    $text = iconv("UTF-8", "ASCII//TRANSLIT", $text);
    // Replace non letter/digit and remove double dash
    $text = preg_replace("/[^\p{L}\p{N}_\-]+/u", "-", $text);
    $text = preg_replace('/-+/', '-', $text);
    // Trim dash at the beginning and end
    $text = trim($text, "-");
    // Convert to lower case(latin) 
    $text = strtolower($text);
    // @return (string by urlencode function)
    return rawurlencode($text);
  }

  public static function getInputData(string $command, array $fieldList): array
  {
    $isKeyword = $command === "search";
    $cleanInput = [];
    foreach ($fieldList as $value) {
      $key = ":" . $value;
      $value = $isKeyword
        ? $_POST["keyword"] ?? ""
        : $_POST[$value] ?? "";
      $cleanInput[$key] = trim($value);
    }

    return $cleanInput;
  }

  public static function setCrudMessage(string $command, string $status): void
  {
    $success = $status == "success";

    switch ($command) {
      case "insert":
        $message =  $success
          ? "insert new novel is successfully"
          : "failed to insert new novel is successfully";
        break;
      case "update":
        $message =  $success
          ? "novel x has been updated"
          : "failed to update novel";
        break;
      case "delete":
        $message =  $success
          ? "novel x has been deleted"
          : "failed to delete novel x";
        break;
      default:
        $message = $command . " is not command";
    }

    $_SESSION["flash_message"] = [
      "message" => $message,
      "alert" => $success ? $status : "danger"
    ];
  }

  public static function isNumericArray($array): bool
  {
    $keys = array_keys($array);
    foreach ($keys as $value) {
      if (!is_numeric($value)) return false;
    }
    return true;
  }

  public static function removeField(array $data, ...$excludeField)
  {
    $fieldList = self::isNumericArray($data) ?  $data : array_keys($data);
    $filter = fn($field) => !in_array($field, $excludeField);
    return array_filter($fieldList, $filter);
  }

  public static function getSprintfParams(string $command, array $fieldList, array $primaryKey): array
  {
    $params = [];

    $setWhereAndClause = in_array($command, ["delete", "update", "select"], true);
    $removePrimaryKey = in_array($command, ["insert", "update", "search"], true);
    $escapeFields = in_array($command, ["update", "search"], true);

    if ($setWhereAndClause) {
      $setClause = fn($field) => "`{$field}` = :{$field}";
      $whereAndClauseArray = array_map($setClause, $primaryKey);
      $params["whereAndClause"] = implode(" AND ", $whereAndClauseArray);
    }

    if ($removePrimaryKey) {
      $fields = self::removeField($fieldList, ...$primaryKey);

      if ($command === "insert") {
        $escape = fn($field) => "`{$field}`";
        $setPlaceholders = fn($field) => ":{$field}";

        $escapedFieldsArray = array_map($escape, $fields);
        $placeholdersArray = array_map($setPlaceholders, $fields);

        $params["escapeFields"] = implode(", ", $escapedFieldsArray);
        $params["placeholders"] = implode(", ", $placeholdersArray);
      }

      if ($escapeFields) {
        $setClause = fn($field) => "`{$field}` = :{$field}";
        $clauseArray = array_map($setClause, $fields);

        if ($command === "update") {
          $params["setClause"] = implode(", ", $clauseArray);
        } else {
          $params["whereOrClause"] = implode(" OR ", $clauseArray);
        }
      }
    }

    return $params;
  }
}
