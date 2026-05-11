<?php
// bdd.php
// Connexion unique à la base de données du site

try {
    $bdd = new PDO(
        'mysql:host=localhost;dbname=tp_web;charset=utf8',
        'root',
        '',
        array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION)
    );
} catch (Exception $e) {
    die('Erreur de connexion à la base de données : ' . $e->getMessage());
}
?>