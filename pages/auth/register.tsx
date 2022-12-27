import { Box, Button, Chip, Grid, Link, TextField, Typography } from "@mui/material";
import { GetServerSideProps } from "next";
import React, { useContext, useState } from "react";
import NextLink from "next/link";
import { AuthLayout } from "../../components/layouts";
import { useForm } from "react-hook-form";
import { ErrorOutline } from "@mui/icons-material";
import { validations } from "../../utils";
import { useRouter } from "next/router";
import { AuthContext } from "../../context";
import { getSession, signIn } from "next-auth/react";

type FormData = {
  name: string;
  email: string;
  password: string;
};

const RegisterPage = () => {
  const router = useRouter();
  const { registerUser } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onRegister = async ({ name, email, password }: FormData) => {
    const { hasError, message } = await registerUser(name, email, password);

    if (hasError) {
      setShowError(true);
      setErrorMessage(message!);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
      return;
    }

    await signIn("credentials", { email, password });
  };

  return (
    <AuthLayout title="Registro">
      <Box onSubmit={handleSubmit(onRegister)} noValidate component="form" sx={{ width: 350, padding: "10px 20px" }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h1" component="h1">
              Registro
            </Typography>
            <Chip
              label={errorMessage}
              color="error"
              icon={<ErrorOutline />}
              className="fadeIn"
              sx={{ display: showError ? "flex" : "none" }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Nombre completo"
              variant="filled"
              fullWidth
              {...register("name", {
                required: "Este campo es requerido",
                minLength: { value: 2, message: "Mínimo 2 caracteres" },
              })}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Correo"
              variant="filled"
              fullWidth
              {...register("email", {
                required: "Este campo es requerido",
                validate: validations.isEmail,
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Contraseña"
              type="password"
              variant="filled"
              fullWidth
              {...register("password", {
                required: "Este campo es requerido",
                minLength: { value: 6, message: "Mínimo 6 caracteres" },
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
          </Grid>

          <Grid item xs={12}>
            <Button color="secondary" type="submit" className="circular-btn" size="large" fullWidth>
              Crear cuenta
            </Button>
          </Grid>

          <Grid item xs={12} display="flex" justifyContent="end">
            <NextLink href={router.query.p ? `/auth/login?p=${router.query.p}` : "/auth/login"} passHref>
              <Link underline="always">Ya tengo cuenta</Link>
            </NextLink>
          </Grid>
        </Grid>
      </Box>
    </AuthLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  const session = await getSession({ req }); // your fetch function here

  const { p = "/" } = query;

  if (session) {
    return {
      redirect: {
        destination: p.toString(),
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default RegisterPage;
