// Importer les modèles nécessaires
const { AclRoleResource } = require("../models");

// Exporter les routes pour être utilisées dans d'autres parties de l'application
module.exports = function (app) {
  // Route pour récupérer la liste des rôles, des ressources et des droits associés
  app.get("/v1/acl", async (req, res) => {
    try {
      // Récupérer toutes les données des rôles et des ressources
      const aclRoleResourceList = await AclRoleResource.findAll();

      // Initialiser les objets pour stocker les rôles, les ressources et les droits associés
      const roles = [];
      const resources = [];
      const acl = {};

      // Parcourir toutes les entrées dans la liste des rôles et des ressources
      aclRoleResourceList.forEach((entry) => {
        // Ajouter le rôle à la liste s'il n'est pas déjà présent
        if (!roles.includes(entry.role)) {
          roles.push(entry.role);
        }
        // Ajouter la ressource à la liste s'il n'est pas déjà présent
        if (!resources.includes(entry.resource)) {
          resources.push(entry.resource);
        }
        // Initialiser ou mettre à jour les droits associés au rôle et à la ressource
        if (!acl.hasOwnProperty(entry.role)) {
          acl[entry.role] = {};
        }
        acl[entry.role][entry.resource] = entry.permission;
      });

      // Retourner la réponse au format spécifié
      res.json({ roles, resources, acl });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // Route pour ajouter un droit à un rôle sur une ressource
  app.post("/v1/acl/:role/:resource", async (req, res) => {
    try {
      const { role, resource } = req.params;
      const permission = req.body.permission; // Vous devrez peut-être récupérer la permission depuis le corps de la requête

      // Vérifier si l'entrée existe déjà dans la base de données
      const existingEntry = await AclRoleResource.findOne({
        where: { role, resource },
      });

      // Si l'entrée existe déjà, mettre à jour la permission
      if (existingEntry) {
        await existingEntry.update({ permission });
        return res.json({
          message: `Permission updated successfully: ${permission}`,
        });
      }

      // Si l'entrée n'existe pas, la créer avec la permission spécifiée
      await AclRoleResource.create({ role, resource, permission });

      res.json({ message: `Permission added successfully: ${permission}` });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // Route pour supprimer un droit à un rôle sur une ressource
  app.delete("/v1/acl/:role/:resource", async (req, res) => {
    try {
      const { role, resource } = req.params;

      // Supprimer l'entrée correspondante de la base de données
      await AclRoleResource.destroy({ where: { role, resource } });

      res.json({ message: "Permission deleted successfully" });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
};
