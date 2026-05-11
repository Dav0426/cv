<?php
// install.php
// Fichier temporaire pour créer la base de données et la table utilisateurs

try {
    $pdo = new PDO(
        'mysql:host=localhost;charset=utf8',
        'root',
        '',
        array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION)
    );

    $pdo->exec("CREATE DATABASE IF NOT EXISTS tp_web CHARACTER SET utf8 COLLATE utf8_general_ci");

    $pdo->exec("USE tp_web");

    $pdo->exec("
        CREATE TABLE IF NOT EXISTS utilisateurs (
            id INT AUTO_INCREMENT PRIMARY KEY,
            login VARCHAR(100) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            nom VARCHAR(100) NOT NULL,
            prenom VARCHAR(100) NOT NULL
        )
    ");

    echo "Base de données et table créées avec succès.";
} catch (Exception $e) {
    die("Erreur : " . $e->getMessage());
}
?>