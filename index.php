<?php
session_start();
?>

<!DOCTYPE html>
<html lang="fr">

<head>
    <!-- Encodage UTF-8 -->
    <meta charset="UTF-8">

    <!-- Responsive mobile -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- Titre -->
    <title>Accueil - Mon univers numérique</title>

    <!-- CSS -->
    <link rel="stylesheet" href="style.css?v=999">
</head>

<body>

<!-- ================= HEADER ================= -->
<header class="hero">

    <!-- Slider -->
    <div class="slider">
        <img src="bg1.jpg" alt="Fond 1">
        <img src="bg2.jpg" alt="Fond 2">
        <img src="bg3.jpg" alt="Fond 3">
    </div>

    <!-- Dark mode -->
    <div class="dark-toggle" onclick="toggleDarkMode()">🌙</div>

    <!-- Texte principal -->
    <div class="hero-content">
        <p class="mini-titre">DAVID AZOULAY</p>

        <h1>Mon univers numérique</h1>

        <p class="sous-titre">
            Portfolio et projets
        </p>
    </div>

</header>

<!-- ================= BURGER ================= -->
<div class="burger" id="burger">
    ☰
</div>

<!-- ================= MENU ================= -->
<nav class="menu-principal" id="menu">

    <a href="index.php" class="actif">Accueil</a>

    <a href="apropos.html">À propos</a>

    <a href="competences.html">Compétences</a>

    <a href="projets.html">Projets</a>

    <a href="contact.html">Contact</a>

    <a href="todo.html">Liste de tâches</a>

    <a href="tailwind.html">Univers digital</a>

    <?php if (isset($_SESSION["connecte"]) && $_SESSION["connecte"] === true) : ?>

        <a href="deconnexion.php" class="menu-auth deconnexion-link">
            Déconnexion
        </a>

    <?php else : ?>

        <a href="login.php" class="menu-auth connexion-link">
            Connexion
        </a>

    <?php endif; ?>

    <?php if (isset($_SESSION["connecte"]) && $_SESSION["connecte"] === true) { ?>
        <a href="deconnexion.php" class="btn-deconnexion">Déconnexion</a>
    <?php } else { ?>
        <a href="login.php" class="btn-connexion">Connexion</a>
    <?php } ?>



</nav>

<!-- ================= CONTENU ================= -->
<main class="conteneur">

    <section class="carte reveal">

        <h2>Bienvenue</h2>

        <p>
            Bienvenue sur mon site personnel.
            Vous y trouverez une présentation de mon parcours,
            de mes compétences et des projets que j’ai réalisés.
        </p>

        <p>
            Ce portfolio met en avant mon intérêt pour le développement web,
            la transformation digitale et l’innovation.
        </p>

        <?php if (isset($_SESSION["connecte"]) && $_SESSION["connecte"] === true) { ?>

            <p class="message-connecte">
                Vous êtes connecté en tant que
                <strong>
                    <?php
                    echo htmlspecialchars($_SESSION["prenom"])
                            . " " .
                            htmlspecialchars($_SESSION["nom"]);
                    ?>
                </strong>
            </p>

        <?php } ?>

    </section>

</main>

<!-- ================= FOOTER ================= -->
<footer class="footer">
    <p>© 2026 - David Azoulay</p>
</footer>

<!-- ================= SCRIPTS ================= -->

<!-- jQuery -->
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>

<!-- JS -->
<script src="jquery.js"></script>
<script src="animations.js"></script>

</body>
</html>