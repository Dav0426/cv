<?php
// traitement_inscription.php
session_start();
require_once "bdd.php";

// Vérifie que tous les champs existent
if (
    isset($_POST["prenom"], $_POST["nom"], $_POST["login"], $_POST["password"], $_POST["confirmation"])
) {
    // Sécurisation contre la faille XSS
    $prenom = htmlspecialchars($_POST["prenom"]);
    $nom = htmlspecialchars($_POST["nom"]);
    $login = htmlspecialchars($_POST["login"]);
    $password = $_POST["password"];
    $confirmation = $_POST["confirmation"];

    // Vérifie que les mots de passe sont identiques
    if ($password !== $confirmation) {
        header("Location: inscription.php?erreur=mdp");
        exit();
    }

    // Hash du mot de passe
    $passwordHash = password_hash($password, PASSWORD_DEFAULT);

    try {
        // Requête préparée contre l'injection SQL
        $requete = $bdd->prepare("
            INSERT INTO utilisateurs (login, password, nom, prenom)
            VALUES (?, ?, ?, ?)
        ");

        $requete->execute([$login, $passwordHash, $nom, $prenom]);

        header("Location: login.php?inscription=ok");
        exit();

    } catch (Exception $e) {

        header("Location: inscription.php?erreur=login");
        exit();
    }

} else {
    header("Location: inscription.php");
    exit();
}
?>