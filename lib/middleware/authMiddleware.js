import jwt from "jsonwebtoken";
import AnomalyCode from "../../anomaly.js";

class AuthMiddleware {
  constructor() {
    this.accessSecret = process.env.JWT_ACCESS_SECRET;
    this.refreshSecret = process.env.JWT_REFRESH_SECRET;
  }

  // Emitir nuevos tokens
  issueTokens(payload) {
    return jwt.sign(payload, this.accessSecret, { expiresIn: "40m" });
    // return { access };
  }
  // Middleware para proteger rutas
  authenticateUser(req, res, next) {
    try {
      const authHeader = req.headers.authorization;
      const token =
        authHeader && authHeader.startsWith("Bearer ")
          ? authHeader.split(" ")[1]
          : null;

      if (!token) {
        return res.status(401).send({
          error: {
            code: AnomalyCode.unauthorized,
            message: "No autorizado: token no proporcionado o mal formado",
          },
        });
      }
      const decoded = jwt.verify(token, this.accessSecret);
      req.user = decoded; // payload completo, no solo id
      return next();
    } catch (err) {
      // Manejar errores específicos de JWT para más claridad
      if (err instanceof jwt.TokenExpiredError) {
        return res.status(401).send({
          error: {
            code: AnomalyCode.unauthorized,
            message: "No autorizado: token expirado",
          },
        });
      }
      if (err instanceof jwt.JsonWebTokenError) {
        return res.status(401).send({
          error: {
            code: AnomalyCode.unauthorized,
            message: "No autorizado: token inválido",
          },
        });
      }
      return res.status(401).send({
        error: {
          code: AnomalyCode.unauthorized,
          message: "No autorizado: error de autenticación",
        },
      });
    }
  }

  // Endpoint para refrescar access token
  refreshToken(req, res) {
    try {
      // El refresh token ahora viene en el body de la petición
      const { refreshToken: rtk } = req.body;
      if (!rtk) {
        return res.status(401).json({
          error: {
            code: AnomalyCode.unauthorized,
            message: "Falta el refresh token en el cuerpo de la petición",
          },
        });
      }

      const payload = jwt.verify(rtk, this.refreshSecret);
      // Creamos un payload limpio para los nuevos tokens, sin 'iat' o 'exp' del token anterior
      const newPayload = {
        id: payload.id,
        username: payload.username,
      };
      const tokens = this.issueTokens(newPayload);

      // Enviamos los nuevos tokens en la respuesta JSON
      return res.json(tokens);
    } catch (err) {
      return res.status(401).json({
        error: {
          code: AnomalyCode.unauthorized,
          message: "Refresh token inválido o expirado",
        },
      });
    }
  }
}

const authMiddleware = new AuthMiddleware();
export default authMiddleware;
