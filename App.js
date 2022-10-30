/* eslint-disable react-native/no-inline-styles */
import React, {Component, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Image,
  FlatList,
  PermissionsAndroid,
  TouchableHighlight,
  Platform,
  View,
  Text,
  ScrollView,
} from 'react-native';
import CameraRoll from '@react-native-community/cameraroll';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      datasource: [],
      loadtext: 'Load More',
      loadmore: true,
      end_cursor: '',
      has_next_page: true,
    };
  }
  /*tryPhotoLoad() {
    if (!this.state.loadingMore) {
      this.setState({loadingMore: true}, () => {
        this.loadPhotos();
      });
    }
  }
  loadPhotos() {
    const fetchParams = {
      first: 35,
      assetType: 'Photos',
    };

    if (this.state.lastCursor) {
      fetchParams.after = this.state.lastCursor;
    }

    CameraRoll.getPhotos(fetchParams)
      .then((data) => {
        this.appendAssets(data);
      })
      .catch((e) => {
        console.log(e);
      });
  }
  appendAssets(data) {
    const assets = data.edges;
    const nextState = {
      loadingMore: false,
    };

    if (!data.page_info.has_next_page) {
      nextState.noMorePhotos = true;
    }

    if (assets.length > 0) {
      nextState.lastCursor = data.page_info.end_cursor;
      nextState.assets = this.state.assets.concat(assets);
      nextState.dataSource = this.state.dataSource.cloneWithRows(
        _.chunk(nextState.assets, 3)
      );
    }

    this.setState(nextState);
  }
  endReached() {
    if (!this.state.noMorePhotos) {
      this.tryPhotoLoad();
    }
  }*/
  componentDidMount() {
    this.data();
  }
  data = async () => {
    if (Platform.OS === 'android') {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Permission Explanation',
          message: 'Gallery would like to access your photos!',
        },
      );
      if (result !== 'granted') {
        console.log('Access to pictures was denied');
        return;
      }
    }
    CameraRoll.getPhotos({
      first: 30,
      assetType: 'Photos',
      include: ['filename', 'fileSize'],
    })
      .then((res) => {
        console.log(res.page_info);
        this.setState({
          datasource: res.edges,
          end_cursor: res.page_info.end_cursor,
          has_next_page: res.page_info.has_next_page,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  Loadmore = async () => {
    console.log('loading');
    if (this.state.has_next_page == true) {
      CameraRoll.getPhotos({
        first: 30,
        assetType: 'Photos',
        after: this.state.end_cursor,
        include: ['filename', 'fileSize'],
      })
        .then((res) => {
          let data = this.state.datasource.concat(res.edges);
          this.setState({
            datasource: data,
            end_cursor: res.page_info.end_cursor,
            has_next_page: res.page_info.has_next_page,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      this.setState({loadtext: 'End of the list'});
    }
  };
  render() {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <ScrollView>
            <FlatList
              data={this.state.datasource}
              renderItem={({item}) => {
                return (
                  <Image
                    style={{
                      width: 130,
                      height: 150,
                    }}
                    source={{uri: item.node.image.uri}}
                  />
                );
              }}
              numColumns={3}
              removeClippedSubviews={true}
              updateCellsBatchingPeriod={200}
              keyExtractor={(item, index) => item.node.image.filename}
            />
            <Text onPress={() => this.Loadmore()}>
              {'\n'}
              {this.state.loadtext}
              {'\n\n\n\n'}
            </Text>
          </ScrollView>
        </SafeAreaView>
      </>
    );
  }
}
const Imagedisplay = ({value}) => {
  const [selected, setSelected] = useState(false);
  const [color, setColor] = useState('#e0e0e0');
  const onselect = async () => {
    if (selected == false) {
      setSelected(true);
      setColor('#29cba4');
      console.log(value.node.image);
    } else if (selected == true) {
      setSelected(false);
      setColor('#e0e0e0');
    }
  };
  return (
    <TouchableHighlight onPress={() => onselect()}>
      <View
        style={{
          backgroundColor: 'transparent',
          borderWidth: 3,
          borderColor: color,
        }}>
        <Image
          style={{
            width: 130,
            height: 150,
          }}
          source={{uri: value.node.image.uri}}
        />
      </View>
    </TouchableHighlight>
  );
};

/*const styles = StyleSheet.create({
  comp: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
  },
  img: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
});*/
