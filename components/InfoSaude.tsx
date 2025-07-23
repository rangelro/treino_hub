import { useEffect, useState } from "react"
import { View, Text, StyleSheet } from "react-native"


interface InfoSaude{
    id:number,
    titulo:string,
    texto:string,
}

const API_URL = 'https://gist.githubusercontent.com/rangelro/18eec1db81e8b3befbf1409293cb2025/raw'

const InfoSaude = () =>{
    const [info,setInfo] = useState<InfoSaude | null>(null)
    
    useEffect(() =>{
        const buscarInfo = async () => {
            try{
                const response = await fetch(API_URL)
                const data: InfoSaude [] = await response.json()
                setInfo(data[Math.floor(Math.random() * data.length)])
            
            }catch(error){
                console.log(error)
            }
        }
        buscarInfo();
    },[]);

    return(
        <View>
            {info &&(
                <>
                <Text style={styles.titulo}>{info.titulo}</Text>
                <Text style={styles.text}>{info.texto}</Text>
                </>

            )}
        </View>
    );


    
};

const styles = StyleSheet.create({
    titulo:{
        fontWeight:'bold',
        color:'#fff',
        fontSize: 18,
        marginBottom:5
    },
    text:{
        color:'#fff',
        fontSize: 15,
        lineHeight:20
    }
});

export default InfoSaude;