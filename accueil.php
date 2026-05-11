<?php
session_start();

if (!isset($_SESSION["connecte"]) || $_SESSION["connecte"] !== true) {

    exit();
}
?>
<a href="index.php">Retour au site</a>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Accueil connecté</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

<main class="form-page">
    <section class="form-card">
        <h1>Connecté</h1>

        <p>
            Bonjour
            <?php echo htmlspecialchars($_SESSION["prenom"]) . " " . htmlspecialchars($_SESSION["nom"]); ?>
        </p>

        <a href="http://localhost/site-web-cv/index.html">
            Retour au site
        </a>
        <br><br>
        <a href="deconnexion.php">Déconnexion</a>
    </section>
</main>

</body>
</html>