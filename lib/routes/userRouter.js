import express from "express";
import userController from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const userRouter = express.Router();
userRouter.use(authMiddleware.authenticateUser.bind(authMiddleware));
/**
 * @swagger
 * /users/inspectors:
 *   get:
 *     summary: Obtener lista de inspectores
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de inspectores obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_usuario:
 *                     type: integer
 *                     example: 1
 *                   nombre:
 *                     type: string
 *                     example: Juan Pérez
 *                   email:
 *                     type: string
 *                     format: email
 *                     example: juan@ejemplo.com
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
userRouter.get("/inspectors", userController.getInspectors);

export default userRouter;
