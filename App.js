import React, {useState} from 'react';
import { View, Text, StatusBar, StyleSheet, TouchableOpacity, Modal, Image, PermissionsAndroid, Platform } from 'react-native';
import { RNCamera } from 'react-native-camera'
import CameraRoll from '@react-native-community/cameraroll'

export default function camera() {
  const [type, setType] = useState(RNCamera.Constants.Type.back)
  const [open, setOpen] = useState(false)
  const [capturedPhoto, setCapturedPhoto] = useState(null)
  
  async function takePicture(camera){
    const options = { quality: 0.5, base64: true }
    const data = await camera.takePictureAsync(options)

    setCapturedPhoto(data.uri)
    setOpen(true)
    console.log('foto tirada' + data.uri)
    savePicture(data.uri)
  }

  async function hasAndroidPermission(){
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

    const hasPermission = await PermissionsAndroid.check(permission);
    if(hasPermission){
      return true;
    }

    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
  }

  async function savePicture(data){
    if(Platform.OS === 'android' && !(await hasAndroidPermission())){
      return;
    }

    CameraRoll.save(data, 'photo')
    .then((res) => {
      console.log('SALVO COM SUCESSO: ' + res)
    })
    .catch((err)=>{
      console.log('ERROR AO SALVAR: ----- ' + err)
    })


  }


  function toggleCam(){
    setType(type === RNCamera.Constants.Type.back ? RNCamera.Constants.Type.front : RNCamera.Constants.Type.back)
  }



 return (
   <View style={styles.container}>
     <StatusBar hidden={true} />

     <RNCamera
      style={styles.preview}
      type={type}
      flashMode={RNCamera.Constants.FlashMode.auto}
      androidCameraPermissionOptions={{
        title: 'Permissao para usar a camera',
        message: 'Nós precisamos usar a sua camera',
        buttonPositive: 'OK',
        buttonNegative: 'Cancelar'
      }}
     >
       {  ({ camera, status, recordAndroidPermissionStatus }) => {
         if(status !== 'READY') return <View/>
         return(
           <View
            style={{marginBottom: 35, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between'}}
           >
            <TouchableOpacity
              onPress={() => takePicture(camera) }
              style={styles.capture}
            >
              <Text>Tirar Foto</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {}}
              style={styles.capture}
            >
              <Text>Album</Text>
            </TouchableOpacity>
           </View>
         )
       }}

      </RNCamera>

      <View style={styles.camPosition}>
        <TouchableOpacity onPress={toggleCam}>
          <Text> Trocar </Text>
        </TouchableOpacity>
      </View>

       {  capturedPhoto &&
        <Modal animationType='slide' transparent={false} visible={open}>
          <View style={{flex:1, justifyContent: 'center', alignItems: 'center',margin: 20}}>
            <TouchableOpacity
            style={{margin: 10}}
            onPress={() => setOpen(false)}
            >
              <Text style={{ fontSize: 24}}>Fechar</Text>
            </TouchableOpacity>

            <Image
            resizeMode='contain'
              style={{width: 650, height: 450, borderRadius: 15}}
              source={{ uri: capturedPhoto}} 
            />
          </View>
        </Modal>
       }
   </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent: 'center'
  },
  preview:{
    flex:1,
    justifyContent:'flex-end',
    alignItems:'center'
  },
  capture:{
    flex: 0,
    backgroundColor:'#FFF',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center'
  },
  camPosition:{
    backgroundColor: '#FFF',
    borderRadius:5,
    padding: 10,
    height: 40,
    position: 'absolute',
    right: 25,
    top: 60,
  }

})