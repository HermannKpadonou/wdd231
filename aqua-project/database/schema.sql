-- Création de la base de données
CREATE DATABASE IF NOT EXISTS sap_gk_groupe CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE sap_gk_groupe;

-- Table des clients
CREATE TABLE clients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom_complet VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    telephone VARCHAR(20),
    type_client ENUM('grossiste', 'revendeur', 'restaurant', 'particulier', 'autre'),
    date_inscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des produits
CREATE TABLE produits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    categorie ENUM('poissons', 'transformes', 'services', 'alevins'),
    prix DECIMAL(10,2),
    description TEXT,
    image_url VARCHAR(255),
    stock INT DEFAULT 0,
    actif BOOLEAN DEFAULT true,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des commandes
CREATE TABLE commandes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT,
    numero_commande VARCHAR(20) UNIQUE,
    total DECIMAL(10,2),
    statut ENUM('en_attente', 'confirmee', 'preparation', 'livree', 'annulee') DEFAULT 'en_attente',
    date_commande TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id)
);

-- Table des détails de commande
CREATE TABLE details_commande (
    id INT AUTO_INCREMENT PRIMARY KEY,
    commande_id INT,
    produit_id INT,
    quantite INT,
    prix_unitaire DECIMAL(10,2),
    FOREIGN KEY (commande_id) REFERENCES commandes(id),
    FOREIGN KEY (produit_id) REFERENCES produits(id)
);

-- Table des contacts
CREATE TABLE contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    telephone VARCHAR(20),
    sujet VARCHAR(100),
    message TEXT,
    date_envoi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    traite BOOLEAN DEFAULT false
);

-- Insertion des produits de base
INSERT INTO produits (nom, categorie, prix, description) VALUES
('Alevins de Silure', 'alevins', 50.00, 'Alevins de silure de qualité, taille 2-3 cm'),
('Silure Marchand', 'poissons', 2000.00, 'Silure frais de première qualité, poids 800g-1.2kg'),
('Tilapia Rouge', 'poissons', 2500.00, 'Tilapia rouge marchand, poids 500g-800g'),
('Filets de Silure', 'transformes', 3000.00, 'Filets de silure surgelés, sans arêtes');