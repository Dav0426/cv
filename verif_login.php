<?php
session_start();
require_once "bdd.php";

// Création du compteur de tentatives si inexistant
if (!isset($_SESSION["tentatives"])) {
    $_SESSION["tentatives"] = 0;
}

if (isset($_POST["login"], $_POST["password"])) {

    // Sécurisation XSS
    $login = htmlspecialchars($_POST["login"]);
    $password = $_POST["password"];

    // Recherche utilisateur
    $requete = $bdd->prepare("SELECT * FROM utilisateurs WHERE login = ?");
    $requete->execute([$login]);

    $utilisateur = $requete->fetch();

    // Vérification mot de passe
    if ($utilisateur && password_verify($password, $utilisateur["password"])) {

        // Remise à zéro des tentatives
        $_SESSION["tentatives"] = 0;

        // Variables de session
        $_SESSION["connecte"] = true;
        $_SESSION["login"] = $utilisateur["login"];
        $_SESSION["prenom"] = $utilisateur["prenom"];
        $_SESSION["nom"] = $utilisateur["nom"];

        // Redirection vers le vrai site
        header("Location: index.php");;
        exit();

    } else {

        // Augmente le nombre de tentatives
        $_SESSION["tentatives"]++;

        // Après 3 erreurs → attente 5 secondes
        if ($_SESSION["tentatives"] >= 3) {

            sleep(5);

            $_SESSION["tentatives"] = 0;
        }

        // Retour login avec erreur
        header("Location: login.php?erreur=1");
        exit();
    }

} else {

    // Si accès direct sans formulaire
    header("Location: index.php");;
    exit();
}
?>