export const emailVerificationTemplate = verificationURL => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bienvenue sur Mentorat</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9; color: #333333;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); border-radius: 8px; overflow: hidden;">
    <!-- Header -->
    <div style="background-color: #4361ee; padding: 30px 20px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">Mentorat</h1>
    </div>
    
    <!-- Content -->
    <div style="padding: 40px 30px;">
      <h2 style="color: #333333; font-size: 22px; margin-top: 0; margin-bottom: 20px;">Bienvenue sur Mentorat !</h2>
      
      <p style="font-size: 16px; line-height: 1.6; margin-bottom: 25px; color: #555555;">
        Merci de vous être inscrit. Pour activer votre compte, veuillez vérifier votre adresse email en cliquant sur le bouton ci-dessous :
      </p>
      
      <div style="text-align: center; margin: 35px 0;">
        <a href="${verificationURL}" style="display: inline-block; background-color: #4361ee; color: white; padding: 14px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; transition: background-color 0.3s ease;">Vérifier mon email</a>
      </div>
      
      <p style="font-size: 16px; line-height: 1.6; margin-bottom: 15px; color: #555555;">
        Si vous n'avez pas créé de compte, veuillez ignorer cet email.
      </p>
      
      <p style="font-size: 16px; line-height: 1.6; margin-bottom: 25px; color: #555555;">
        Ce lien expirera dans 24 heures.
      </p>
      
      <div style="background-color: #f5f7ff; border-left: 4px solid #4361ee; padding: 15px; margin-bottom: 25px; border-radius: 4px;">
        <p style="font-size: 15px; line-height: 1.5; margin: 0; color: #555555;">
          Si le bouton ne fonctionne pas, vous pouvez copier et coller le lien suivant dans votre navigateur :
        </p>
        <p style="word-break: break-all; font-size: 14px; margin-top: 10px; margin-bottom: 0; color: #4361ee;">
          ${verificationURL}
        </p>
      </div>
      
      <p style="font-size: 16px; line-height: 1.6; margin-bottom: 0; color: #555555;">
        Cordialement,<br>
        <strong>L'équipe Mentorat</strong>
      </p>
    </div>
    
    <!-- Footer -->
    <div style="background-color: #f5f7ff; padding: 25px 30px; text-align: center; border-top: 1px solid #e8eaf6;">
      <p style="font-size: 14px; color: #777777; margin: 0 0 15px 0;">
        © 2024 Mentorat. Tous droits réservés.
      </p>
      <div>
        <!-- Social Media Icons -->
        <a href="#" style="display: inline-block; margin: 0 8px; text-decoration: none;">
          <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" width="24" height="24" style="border: 0;">
        </a>
        <a href="#" style="display: inline-block; margin: 0 8px; text-decoration: none;">
          <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" width="24" height="24" style="border: 0;">
        </a>
        <a href="#" style="display: inline-block; margin: 0 8px; text-decoration: none;">
          <img src="https://cdn-icons-png.flaticon.com/512/733/733558.png" alt="LinkedIn" width="24" height="24" style="border: 0;">
        </a>
      </div>
    </div>
  </div>
</body>
</html>

`;
