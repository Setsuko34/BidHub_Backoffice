import React, {useState, useEffect} from "react";
import {
  Typography,
  Box,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Link,
} from "@mui/material";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import Appbar from "../../utils/AppBar";
import {useParams} from "react-router-dom";
import * as articleLogic from "./ArticleLogic";
import ArticleModal from "../../utils/Modals/ArticleModal";
import {Carousel} from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import {Grid} from "react-loader-spinner";
import EncheresList from "../EncheresRelatedView/EncheresList";
// requires a loader

const ArticleDetail = () => {
  const {idArticle} = useParams();
  const [loading, setLoading] = useState(true);
  const [article, setArticle] = useState({});
  const [creator, setCreator] = useState({}); //[creator, setCreator

  useEffect(() => {
    articleLogic.GetInfo(idArticle, setArticle, setCreator);
    setLoading(false);
  }, [idArticle]);
  if (loading) {
    return (
      <div className="page-centered">
        <Grid
          visible={true}
          height="80"
          width="80"
          color="#FFA31A"
          ariaLabel="grid-loading"
          radius="12.5"
          wrapperStyle={{}}
          wrapperClass="grid-wrapper"
        />
      </div>
    );
  }

  return (
    <div>
      <Appbar />
      <Box
        sx={{
          display: "flex",
          flex: 1,
          alignItems: "center",
          justifyContent: "right",
          paddingBottom: 5,
        }}
      >
        <ArticleModal
          article={article}
          setArticle={setArticle}
          idArticle={idArticle}
          refresh={setLoading}
        />
      </Box>
      <Carousel showArrows={false} showThumbs={false} autoPlay>
        {article.img_list?.map((img, index) => {
          return (
            <div>
              <img key={index} src={img} alt="img" style={{width: "25%"}} />
            </div>
          );
        })}
      </Carousel>
      <Card sx={{maxWidth: "100%", marginY: 3}}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {article.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Createur : {creator.username}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Date et heure de fin:{" "}
            {article.date_heure_fin?.toDate()?.toLocaleString()}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Prix de départ: {article.prix_depart}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Description de l'article : {article.description}
          </Typography>
          <Link
            color="primary"
            href={article.url_article}
            level="body-lg"
            underline="hover"
            variant="solid"
          >
            Voir l'article
          </Link>
        </CardContent>
      </Card>
      <EncheresList idArticle={idArticle} />
    </div>
  );
};

export default ArticleDetail;
