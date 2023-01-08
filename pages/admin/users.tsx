import { PeopleOutline } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { AdminLayout } from "../../components/layouts";
import { DataGrid, GridColDef, GridValidRowModel } from "@mui/x-data-grid";
import { Grid, MenuItem, Select, Typography } from "@mui/material";
import useSWR from "swr";
import { IUser } from "../../interfaces";
import tesloApi from "../../api/tesloApi";

const UsersPage = () => {
  const { data, error } = useSWR<IUser[]>("/api/admin/users");
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    if (data) {
      setUsers(data);
    }
  }, [data]);

  if (!error && !data) {
    return <>Cargando..</>;
  }

  if (error) {
    console.log(error);
    return <Typography>Error al cargar la información</Typography>;
  }

  const onRoleUpdated = async (userId: string, newRole: string) => {
    const previousUsers = users.map((user) => ({
      ...user,
    }));
    const updatedUsers = users.map((user) => ({
      ...user,
      role: userId === user._id ? newRole : user.role,
    }));

    setUsers(updatedUsers);

    try {
      await tesloApi.put("/admin/users", { userId, role: newRole });
    } catch (error) {
      setUsers(previousUsers);
      alert("No se pudo actualizar el role del usuario");
    }
  };

  const columns: GridColDef[] = [
    { field: "email", headerName: "Correo", width: 250 },
    { field: "name", headerName: "Nombre completo", width: 300 },
    {
      field: "role",
      headerName: "Rol",
      width: 300,
      renderCell: ({ row }: GridValidRowModel) => {
        return (
          <Select
            value={row.role}
            onChange={({ target }) => onRoleUpdated(row.id, target.value)}
            label="Rol"
            sx={{ width: "300px" }}
          >
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="client">Client</MenuItem>
            <MenuItem value="super-user">Super user</MenuItem>
            <MenuItem value="seo">SEO</MenuItem>
          </Select>
        );
      },
    },
  ];

  const rows = users!.map((user) => ({
    id: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
  }));

  return (
    <AdminLayout title="Usuarios" subTitle="Mantenimiento de usuarios" icon={<PeopleOutline />}>
      <Grid container className="fadeIn">
        <Grid item xs={12} sm={12} sx={{ height: 650, width: "100%" }}>
          <DataGrid rows={rows} columns={columns} pageSize={10} rowsPerPageOptions={[10]} />
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

export default UsersPage;
