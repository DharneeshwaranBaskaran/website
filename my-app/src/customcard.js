import React from "react";
import { Card, CardContent, CardMedia, Button, Typography,CardActions } from "@mui/material";
import { FaStar } from 'react-icons/fa';
import './App.css'; 
function CustomCard({ item, handleView ,showButton}) {
  if (item.stockcount <= 0) { 
    
    return (
      <div key={item.id} className='class'>
        <Card>
          <CardMedia component="img" image={item.url} alt="img" />
          <CardContent className="card-content" style={{ paddingTop: '20px' }}>
            <Typography gutterBottom variant="h6">
              <p style={{ textAlign: "center" }}>{item.topic}</p>
            </Typography> 
            
            <div class="containcard" style={{ marginLeft: '0px' }}>
              <Typography gutterBottom fontWeight="bold">
                <p>${item.cost}</p>
              </Typography>
              
              <Typography gutterBottom fontWeight="bold">
                <div className='star-Rating'>
                  <FaStar size={15} color="black" />{item.rating}
                </div>
                
              </Typography > 
              <Typography >
             
            <div className="discount-label">Out Of Stock</div>
           </Typography>
            </div>
          </CardContent>
           
          <CardActions className="card-actions">
            {/* <Button
              variant="contained"
              className="card-button"
              fullWidth
              onClick={() => handleView(item.topic )}
            >View
          </Button> */}
          </CardActions>
          
        </Card>
      </div>
    );
  }
  else if (item.count == 0) { 
    
  return (
    <div key={item.id} className='class'>
      <Card>
        <CardMedia component="img" image={item.url} alt="img" />
        <CardContent className="card-content" style={{ padding: '0px' }}>
          <Typography gutterBottom variant="h6">
            <p style={{ textAlign: "center" }}>{item.topic}</p>
          </Typography> 
          
          <div class="containcard" style={{ marginLeft: '0px' }}>
            <Typography gutterBottom fontWeight="bold">
              <p>${item.cost}</p>
            </Typography>
            
            <Typography gutterBottom fontWeight="bold">
              <div className='star-Rating'>
                <FaStar size={15} color="black" />{item.rating}
              </div>
              
            </Typography > 
            <Typography >
            {item.count == 0 && (
          <div className="discount-label">10% OFF</div>
        )} </Typography>
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
  else{
    
    return (
      <div key={item.id} className='class'>
        <Card>
          <CardMedia component="img" image={item.url} alt="img" />
          <CardContent className="card-content" style={{ padding: '0px' }}>
            <Typography gutterBottom variant="h6">
              <p style={{ textAlign: "center" }}>{item.topic}</p>
            </Typography>
            
            <div class="containcard" style={{ marginLeft: '25px' }}>
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
    );}
  }


export default CustomCard;
