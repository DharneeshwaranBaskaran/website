import React from "react";
import { Card, CardContent, CardMedia, Button, Typography,CardActions } from "@mui/material";
import { FaStar } from 'react-icons/fa';

function CustomCard({ item, handleView ,showButton}) {
  
  return (
    <div key={item.id} className='class'>
      <Card>
        <CardMedia component="img" image={item.url} alt="img" />
        <CardContent className="card-content" style={{ padding: '0px' }}>
          <Typography gutterBottom variant="h6">
            <p style={{ textAlign: "center" }}>{item.topic}</p>
          </Typography>
          <div class="contain" style={{ marginLeft: '25px' }}>
            <Typography gutterBottom fontWeight="bold">
              <p>${item.cost}</p>
            </Typography>

            <Typography gutterBottom fontWeight="bold">
              <div className='star-Rating'>
                <FaStar size={15} color="black" />{item.rating}
              </div>

            </Typography>
          </div>
        </CardContent>
         
        <CardActions className="card-actions">
          <Button
            variant="contained"
            className="card-button"
            fullWidth
            onClick={() => handleView(item.topic )}
          >View
        </Button>
        </CardActions>
        
      </Card>
    </div>
  );
}

export default CustomCard;
