import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { Avatar, Box } from "@mui/material";
import { useEffect, useState } from "react";
import { listDocuments, createOrUpdateDocument } from "../utils/firestoreUtils";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import AlertDelete from "../components/common/AlertDelete";

interface User {
  id: string;
  name: string | null;
  email: string;
  photoURL: string | null;
  role: string;
}

interface UserDocuments {
  id: string;
  data: User;
}

const roles = ["admin", "user", "guest"];
const Users = () => {
  const [users, setUsers] = useState<UserDocuments[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userDocuments = await listDocuments("users");
        setUsers(userDocuments as UserDocuments[]);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const updateUserList = async () => {
    try {
      const userDocuments = await listDocuments("users");
      setUsers(userDocuments as UserDocuments[]);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const columns: GridColDef[] = [
    { field: "num", headerName: "#", width: 70, align: "center" },
    { field: "displayName", headerName: "Nombre", width: 300 },
    { field: "email", headerName: "Correo electrónico", width: 300 },
    {
      field: "role",
      headerName: "Rol",
      type: "singleSelect",
      valueOptions: roles,
      width: 150,
      renderCell: (params) => (
        <Select
          labelId="role-label"
          id="role"
          value={params.value}
          label="Age"
          onChange={(event) => handleChange(event, params.id.toString())}
          sx={{ width: "100%" }}
        >
          {roles.map((option, index) => (
            <MenuItem key={index} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      ),
    },
    {
      field: "photoURL",
      headerName: "Foto de perfil",
      renderCell: ({ value }) => <Avatar alt="user" src={value as string} />,
    },
    {
      field: "actions",
      headerName: "Acciones",
      renderCell: (params) => (
        <AlertDelete
          id={String(params.id)}
          collectionName={String("users")}
          onUpdate={updateUserList}
        />
      ),
    },
  ];

  const usersWithNumeration = users.map((user, index) => ({
    ...user.data,
    id: user.id,
    num: index + 1,
  }));

  const handleChange = async (event: SelectChangeEvent, userId: string) => {
    const newRole = event.target.value;
    await createOrUpdateDocument("users", userId, { role: newRole });
    const userDocuments = await listDocuments("users");
    setUsers(userDocuments as UserDocuments[]);
  };

  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "#101935",
        boxShadow: "0px 0px 20px 0px rgba(0,0,0,0.4)",
        borderRadius: "10px",
        padding: "20px",
      }}
    >
      <DataGrid
        sx={{
          border: "none",
          "@media (max-width: 600px)": {
            width: "calc(100vw - 95px)",
          },
        }}
        rows={usersWithNumeration}
        columns={columns}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
          },
        }}
      />
    </Box>
  );
};

export default Users;
