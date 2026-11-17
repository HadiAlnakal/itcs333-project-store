<?php
declare(strict_types=1);

/**
 * ITCS333 Project starter — m2_catalog handler (module under construction).
 * Implement the endpoints in contracts/ for your module.
 * The routing context is in $GLOBALS['__route'] ('area', 'rest', 'uri').
 * Use db() from src/db.php and the helpers in src/http.php.
 */

$rest = $GLOBALS['__route']['rest'] ?? '';
// Test m2_catalog using GitHub Actions


if (http_method() === 'GET' && trim($rest, '/') === 'products') {

    $pdo = db();

    $sql = "SELECT id, category_id, name, price, stock
            FROM products WHERE 1=1";

    $category = $_GET['category_id'] ?? '';
    $search = $_GET['q'] ?? '';

    if ($category !== '') {
        $sql .= " AND category_id = :category_id";
    }

    if ($search !== '') {
        $sql .= " AND name LIKE :search";
    }

    $sql .= " ORDER BY id";

    $stmt = $pdo->prepare($sql);

    if ($category !== '') {
        $stmt->bindValue(':category_id', (int) $category, PDO::PARAM_INT);
    }

    if ($search !== '') {
        $stmt->bindValue(':search', '%' . $search . '%');
    }

    $stmt->execute();

    $products = $stmt->fetchAll();

    send_json(200, ['data' => $products]);
}


$parts = explode('/', trim($rest, '/'));

if (http_method() === 'GET' && count($parts) === 2 && $parts[0] === 'products') {

    $id = param_id($parts[1]);

    if ($id === null) {
        send_error(404, 'NOT_FOUND');
    }

    $pdo = db();

    $sql = "SELECT id, category_id, name, price, stock
            FROM products WHERE id = :id";

    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':id', $id, PDO::PARAM_INT);
    $stmt->execute();

    $product = $stmt->fetch();

    if ($product === false) {
        send_error(404, 'NOT_FOUND');
    }

    send_json(200, $product);
}



if (http_method() === 'GET' && trim($rest, '/') === 'categories') {

    $pdo = db();

    $sql = "SELECT id, name FROM categories ORDER BY id";

    $stmt = $pdo->prepare($sql);
    $stmt->execute();

    $categories = $stmt->fetchAll();

    send_json(200, ['data' => $categories]);
}



send_error(501, 'NOT_IMPLEMENTED', ['module' => 'm2_catalog', 'rest' => $rest]);
