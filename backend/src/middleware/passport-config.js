const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const { PrismaClient } = require("../../generated/prisma");
const prisma = new PrismaClient();

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: "keloke", // ¡La misma clave secreta que usaste para firmar los JWTs!
};

passport.use(
  new JwtStrategy(options, async (jwt_payload, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: jwt_payload.userId },
      });
      if (user) {
        return done(null, user); // Usuario encontrado, adjúntalo a la request
      } else {
        return done(null, false); // Usuario no encontrado
      }
    } catch (error) {
      return done(error, false);
    }
  })
);
