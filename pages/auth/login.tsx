import { Box, Button, Chip, Divider, Grid, Link, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import NextLink from "next/link";
import { AuthLayout } from "../../components/layouts/AuthLayout";
import { useForm } from "react-hook-form";
import { validations } from "../../utils";
import { ErrorOutline } from "@mui/icons-material";
import { useRouter } from "next/router";
import { getSession, signIn, getProviders } from "next-auth/react";
import { GetServerSideProps } from "next";

type FormData = {
  email: string;
  password: string;
};

const LoginPage = ({ providers }: any) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [showError, setShowError] = useState(false);
  // const [providers, setProviders] = useState<any>({});
  const router = useRouter();

  // useEffect(() => {
  //   getProviders().then((prov) => {
  //     setProviders(prov);
  //   });
  // }, []);

  const onLoginUser = async ({ email, password }: FormData) => {
    setShowError(false);

    await signIn("credentials", { email, password });
  };

  return (
    <AuthLayout title="Ingresar">
      <Box onSubmit={handleSubmit(onLoginUser)} noValidate sx={{ width: 350, padding: "10px 20px" }} component="form">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h1" component="h1">
              Iniciar Sesión
            </Typography>
            <Chip
              label="No reconocemos ese usuario / contraseña"
              color="error"
              icon={<ErrorOutline />}
              className="fadeIn"
              sx={{ display: showError ? "flex" : "none" }}
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
            <Button type="submit" color="secondary" className="circular-btn" size="large" fullWidth>
              Ingresar
            </Button>
          </Grid>
          <Grid item xs={12} display="flex" justifyContent="end">
            <NextLink href={router.query.p ? `/auth/register?p=${router.query.p}` : "/auth/register"} passHref>
              <Link underline="always">¿No tienes cuenta?</Link>
            </NextLink>
          </Grid>

          <Grid item xs={12} display="flex" flexDirection="column" justifyContent="end">
            <Divider sx={{ width: "100%", mb: 2 }} />
            {Object.values(providers).map((provider: any) => {
              if (provider.id === "credentials") return <div key="credentials"></div>;

              return (
                <Button
                  key={provider.id}
                  variant="outlined"
                  onClick={() => signIn(provider.id)}
                  fullWidth
                  color="primary"
                  sx={{ mb: 1 }}
                >
                  {provider.name}
                </Button>
              );
            })}
          </Grid>
        </Grid>
      </Box>
    </AuthLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  const session = await getSession({ req });
  const providers = await getProviders();

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
    props: { providers },
  };
};

export default LoginPage;
