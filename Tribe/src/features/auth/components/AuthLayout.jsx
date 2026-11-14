import { Link as RouterLink } from "react-router-dom";

import { Box, Link, Paper, Typography } from "@mui/material";

import HeroVisual from "./HeroVisual.jsx";
import "../auth.css";

/*
  showcase = { kicker, line1, line2 }
  یک خط کوچک بالای دو خط شعار درشت.
*/
export default function AuthLayout({
  switchPrompt,
  switchLabel,
  switchTo,
  title,
  subtitle,
  showcase = {},
  children,
}) {
  return (
    <Box className="auth-page">
      {/* لوگو در گوشه بالا سمت چپ */}
      <Box component={RouterLink} to="/" className="auth-logo" aria-label="Tribe">
        <img src="/tribe-logo.svg" alt="Tribe" />
      </Box>

      {/* بخش معرفی (سمت چپ) */}
      <Box className="auth-showcase">
        <Box className="auth-showcase-content">
          <Box className="auth-showcase-text">
            {showcase.kicker && (
              <Typography component="p" className="auth-kicker">
                {showcase.kicker}
              </Typography>
            )}
            {/* شعار، عنوان صفحه نیست؛ تنها h1 همان عنوان فرم است */}
            <Typography component="p" className="auth-slogan">
              <span>{showcase.line1}</span>
              <span>{showcase.line2}</span>
            </Typography>
          </Box>

          <HeroVisual />
        </Box>
      </Box>

      {/* فرم (سمت راست) */}
      <Paper component="main" elevation={0} className="auth-card" aria-labelledby="auth-title">
        <Box className="auth-form-box">
          <Box className="auth-intro">
            <Typography component="h1" id="auth-title">{title}</Typography>
            {subtitle && <Typography component="p">{subtitle}</Typography>}
          </Box>

          {children}

          {switchTo && (
            <Box className="auth-switch">
              <Typography component="span" variant="body2">
                {switchPrompt}
              </Typography>
              <Link component={RouterLink} to={switchTo} underline="none">
                {switchLabel}
              </Link>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
}
