import React, {Component} from 'react';
import {
  Text,
  View,
  TextInput,
  Button,
  Image,
  FlatList,
  Keyboard,
  TouchableHighlight,
  Modal,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import axios from 'axios';
// import FastImage from 'react-native-fast-image'
// import {
//     CachedImage,
//     ImageCacheProvider
// } from 'react-native-cached-image';

class Fetchimages extends Component {
    constructor() {
        super();
        this.state = {
            search:'',
            imagesData:[],
            isModalVisible: false,
            imagesrc:null
        };
        
    }
    
    search = () => {
        Keyboard.dismiss();
        this.setState({imagesData:[]})
        axios.get('https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=636e1481b4f3c446d26b8eb6ebfe7127&per_page=12&format=json&nojsoncallback=1&tags= '+this.state.search)
        .then((response) => {
            response.data['photos']['photo'].forEach(element => {
                this.state.imagesData.push(element);
            });
            this.setState({imagesData:this.state.imagesData});
        })
        .catch((error) => {
            alert('Error in getting your result');
        })
    }

    renderItem = ({item,index}) => {
        return (
            <View>
                <TouchableHighlight onPress={() => this.openModal(item)}>
                    <Image style={{width:120,height:120,margin:8}} source={{uri:"https://farm"+item.farm+".staticflickr.com/"+item.server+"/"+item.id+"_"+item.secret+"_m.jpg"}} />
                </TouchableHighlight>
            </View>
        )
    }

    renderList() {
        return(
            <FlatList 
                data={this.state.imagesData}
                keyExtractor={item => item.id}
                numColumns={3} 
                renderItem={this.renderItem}
            />
        )
    }

    openModal(item) {
        this.setState({
            isModalVisible: !this.state.isModalVisible,
            imagesrc: "https://farm"+item.farm+".staticflickr.com/"+item.server+"/"+item.id+"_"+item.secret+"_b.jpg"
        });
    }

    closeModal() {
        this.setState({isModalVisible: !this.state.isModalVisible});
    }

    render() {
        return(
            <View>
                <View style={styles.maincontainer}>
                    <TextInput 
                        placeholder='Search'
                        onChangeText={value => this.setState({search:value})}
                        style={{width:300,marginLeft:20}}
                    />
                    <Button title='go' onPress={this.search} />
                </View>
                {this.renderList()}
                <Modal visible={this.state.isModalVisible}>
                    <View style={{justifyContent:"center"}}>
                    <TouchableOpacity
                        style={{borderRadius:100,backgroundColor:'red',width:30}}
                        onPress ={() => this.closeModal()}
                    >
                        <Text style={{textAlign:"center"}}>X</Text>
                    </TouchableOpacity>
                        <Image style={{width:350,height:350,margin:10,alignSelf:"center"}} source={{uri:this.state.imagesrc}} />
                        {/* <FastImage style={{width:350,height:350,margin:10,alignSelf:"center"}} source={{uri:this.state.imagesrc}} /> */}
                        {/* <CachedImage style={{width:350,height:350,margin:10,alignSelf:"center"}} source={{uri:this.state.imagesrc}} /> */}
                    </View>
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    maincontainer:{
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        margin:10,
    },
});

export default Fetchimages;