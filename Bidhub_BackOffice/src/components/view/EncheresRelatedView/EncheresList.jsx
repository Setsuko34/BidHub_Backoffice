import React, {useEffect, useState} from "react";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import {Box, Typography} from "@mui/material";
import {GetEncheres} from "./EncheresLogic";
import ArticlesActionsMenu from "../../utils/ActionMenu/ArticlesActionsMenu";
import EnchereModal from "../../utils/Modals/EnchereModal";
import {alignProperty} from "@mui/material/styles/cssUtils";
import EncheresActionsMenu from "../../utils/ActionMenu/EncheresActionsMenu";

const EncheresList = (idArticle) => {
  const [encheres, setEncheres] = useState([]);
  useEffect(() => {
    if (idArticle) {
      GetEncheres(idArticle, setEncheres);
    }
  }, [idArticle]);

  if (encheres.length === 0) {
    return (
      <Box>
        <Box
          sx={{
            display: "flex",
            flex: 1,
            alignItems: "center",
            justifyContent: "space-between",
            paddingY: 3,
          }}
        >
          <Typography variant="h4">Enchères de l'article</Typography>
          <EnchereModal setEncheres={setEncheres} idArticle={idArticle} />
        </Box>
        <Typography>Aucune enchère pour cet article</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flex: 1,
          alignItems: "center",
          justifyContent: "space-between",
          paddingY: 3,
        }}
      >
        <Typography variant="h4">Enchères de l'article</Typography>
        <EnchereModal setEncheres={setEncheres} idArticle={idArticle} />
      </Box>
      <DataGrid
        columns={[
          {
            field: "date_enchere",
            headerName: "Date enchère",
            flex: 1,
            alignItems: "center",
            renderCell: (params) => (
              <Typography sx={{alignContent: "center", height: "100%"}}>
                {" "}
                {params.row.date_enchere.toDate().toLocaleString()}
              </Typography>
            ),
          },
          {field: "id_user", headerName: "ID utilisateur", flex: 1},
          {
            field: "montant",
            headerName: "Montant",
            headerAlign: "center",
            flex: 1,
            align: "center",
          },
          {
            field: "actions",
            width: 300,
            align: "center",
            renderCell: (params) => (
              <EncheresActionsMenu
                enchereId={params.row.id}
                enchere={params.row}
                setEncheres={setEncheres}
                idArticle={idArticle}
              />
            ),
          },
        ]}
        rows={encheres}
        getRowId={(row) =>
          row.id_articles + row.id_user + row.date_enchere.seconds
        }
        // assuming this combination is unique for each row
        pageSize={5}
        sx={{height: "80vh", width: "100%"}}
        slots={{toolbar: GridToolbar}}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
          },
        }}
      />
    </Box>
  );
};

export default EncheresList;
