<?php
session_start();
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Connexion</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

<main class="form-page">
    <section class="form-card">

        <h1>Connexion</h1>

        <?php
        if (isset($_GET['erreur'])) {
            echo "<p class='erreur'>Identifiant ou mot de passe incorrect</p>";
        }

        if (isset($_GET['inscription'])) {
            echo "<p class='succes'>Compte créé avec succès</p>";
        }
        ?>

        <form action="verif_login.php" method="post">

            <label for="login">Identifiant</label>
            <input type="text" id="login" name="login" required>

            <label for="password">Mot de passe</label>
            <input type="password" id="password" name="password" required>

            <button type="submit">Se connecter</button>

        </form>

        <p>
            Pas encore inscrit ?
            <a href="inscription.php">Créer un compte</a>
        </p>

    </section>
</main>

</body>
</html>