<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    $database = new Database();
    $db = $database->getConnection();
    
    try {
        // Commencer une transaction
        $db->beginTransaction();
        
        // 1. Vérifier ou créer le client
        $clientQuery = "SELECT id FROM clients WHERE email = ?";
        $stmt = $db->prepare($clientQuery);
        $stmt->execute([$input['customer']['email']]);
        $client = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$client) {
            $clientQuery = "INSERT INTO clients (nom_complet, email, telephone) VALUES (?, ?, ?)";
            $stmt = $db->prepare($clientQuery);
            $stmt->execute([
                $input['customer']['name'],
                $input['customer']['email'],
                $input['customer']['phone']
            ]);
            $client_id = $db->lastInsertId();
        } else {
            $client_id = $client['id'];
        }
        
        // 2. Créer la commande
        $commandeQuery = "INSERT INTO commandes (client_id, numero_commande, total) VALUES (?, ?, ?)";
        $stmt = $db->prepare($commandeQuery);
        $stmt->execute([$client_id, $input['order_number'], $input['total']]);
        $commande_id = $db->lastInsertId();
        
        // 3. Ajouter les détails de commande
        $detailsQuery = "INSERT INTO details_commande (commande_id, produit_id, quantite, prix_unitaire) VALUES (?, ?, ?, ?)";
        $stmt = $db->prepare($detailsQuery);
        
        foreach ($input['items'] as $item) {
            $stmt->execute([$commande_id, $item['product_id'], $item['quantity'], $item['price']]);
        }
        
        // Valider la transaction
        $db->commit();
        
        echo json_encode(['success' => true, 'order_id' => $commande_id]);
        
    } catch (Exception $e) {
        $db->rollBack();
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
}
?>