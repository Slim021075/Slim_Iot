

   
function startConnect() {

    clientID = "clientID - " + parseInt(Math.random() * 100);

    host = document.getElementById("host").value;

    //fixer le port  8884
    port = 8884
    //port = document.getElementById("port").value;

    userId = document.getElementById("username").value;
    passwordId = document.getElementById("password").value;


    document.getElementById("Mess_connect").innerHTML += " You are connected to the hivemq broker using the " + clientID + "<br>";    
    //"<span> Connecting to " + host + "on port " + port + "</span><br>";
    //document.getElementById("Mess_connect").innerHTML += "<span> Using the client Id " + clientID + " </span><br>";

    client = new Paho.MQTT.Client(host, Number(port), clientID);

    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;
    

    

    client.connect({
        //onSuccess: onConnect,
        userName: userId,
        password: passwordId,
        useSSL: true
    });


}


function sub_topic_tem() {
    if(document.getElementById("topic_tem").checked)
    {topic_t = document.getElementById("topic_tem").value;

    document.getElementById("Mess_t").innerHTML += " Subscribing to topic " + topic_t + "<br>";

    client.subscribe(topic_t);}
    else 
    {client.unsubscribe(topic_t);
        temperatureHumidityChart.data.datasets[0].data[0] = [0];
        temperatureHumidityChart.update();
    }
}

function sub_topic_hum() {
    if(document.getElementById("topic_hum").checked)
    {topic_h= document.getElementById("topic_hum").value;

    document.getElementById("Mess_h").innerHTML += " Subscribing to topic " + topic_h + "<br>";

    client.subscribe(topic_h);}
    else 
    {client.unsubscribe(topic_h);
        temperatureHumidityChart.data.datasets[0].data[1] = [0];
        temperatureHumidityChart.update();
    }
}


function onConnectionLost(responseObject) {   
    if (responseObject != 0) {
        document.getElementById("Mess_connect").innerHTML += "Connection is lost with ERROR:" + responseObject.errorMessage + "<br>";
    }
}

function onMessageArrived(message) {
    if(document.getElementById("topic_tem").checked)
        {if(message.destinationName===document.getElementById("topic_tem").value)
         {document.getElementById("Mess_t").innerHTML += "The temprature value is : " + message.payloadString + "<br>"; var tempo=parseFloat(message.payloadString);
            temperatureHumidityChart.data.datasets[0].data[0] = [tempo];
           
            temperatureHumidityChart.update();
            
            }
         
        }
       
         
    if(document.getElementById("topic_hum").checked)
        {if(message.destinationName===document.getElementById("topic_hum").value)
         {document.getElementById("Mess_h").innerHTML += "The humidity value is : " + message.payloadString + "<br>";var humi=parseFloat(message.payloadString);
            temperatureHumidityChart.data.datasets[0].data[1] = [humi];
            
            temperatureHumidityChart.update();
            }
         }
         
         
}; 
    

function startDisconnect() {
    client.disconnect();
    document.getElementById("Mess_connect").innerHTML += " Disconnected!! <br>";
    temperatureHumidityChart.data.datasets[0].data[0] = [0];
    temperatureHumidityChart.data.datasets[0].data[1] = [0];
    temperatureHumidityChart.update();
}

function publishMessage() {

    if(document.getElementById("Led_on").checked)
    
        msg="on";    
    else
        msg="off";

    //msg = document.getElementById("Mess_pub").value;
    topic = document.getElementById("topic_p").value;

    Message = new Paho.MQTT.Message(msg);
    Message.destinationName = topic;

    client.send(Message);
    document.getElementById("Mess_pub").innerHTML += " Message to topic " + topic + " is sent<br>";


}

// Données pour la température et l'humidité


 const data = {
    labels:  ["Temperature", "Humidity"],  // Les catégories sur l'axe X
    datasets: [{
        label:'Temperature and Humidity',
        data: [0,0],  // Valeur pour Température et Humidité
        backgroundColor: ['rgba(255, 0, 0)', 'rgba(0, 112, 192)'],  // Couleur des barres
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)'],  // Couleur des bordures
        borderWidth: 1
    }]
};


// Configuration du graphique
const config = {
type: 'bar',  // Type de graphique : barres
data: data,
options: {
responsive: true,

scales: {
    x: {
        title: {
            display: true,
           
        }
    },
    y: {
        title: {
            display: true,
            text: 'Values'
        },
        suggestedMin: 0,  // Valeur minimale pour l'axe Y
        suggestedMax: 90,   // Valeur maximale pour l'axe Y
        
    }
    
}
    }

}
// Création du graphique
 const ctx = document.getElementById('temperatureHumidityChart').getContext('2d');
const temperatureHumidityChart = new Chart(ctx, config); 



