import * as React from 'react'
import { Text, StyleSheet, View, Image, StatusBar, ScrollView, TextInput, TouchableOpacity, Modal, RefreshControl, FlatList, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ImagePicker from 'react-native-image-crop-picker';
import { Appbar, Button, FAB, Portal, Provider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class NoteApp extends React.Component {

    constructor() {
        super()
        this.state = {
            arr: [
            ],
            
            search_value: '',
            new_header: '',
            new_note: '',
            new_img: '',
            note_img: '',
            visible_modal: false,
            use_index: 0,
            saveAction: true,
            my_fba: { open: false },
            mood: false,
            img_action: false,

        }
    }

    async componentDidMount() {
        let my_data = JSON.parse(await AsyncStorage.getItem('my_note'))

        this.setState({ arr: my_data })
    }

    async deleteItem(index) {
        let my_arr = this.state.arr
        my_arr.splice(index, 1)
        this.setState({ arr: my_arr, img_action: false })

        await AsyncStorage.setItem('my_note', JSON.stringify(my_arr))

    }

    async addItem() {
        let my_arr = this.state.arr
        let add_header = this.state.new_header
        let add_note = this.state.new_note
        let add_image = { uri: this.state.new_img }
        let my_obj = {
            header: add_header,
            note: add_note,
            image: add_image,
        }
        my_arr.push(my_obj)
        this.setState({
            arr: my_arr
        })

        await AsyncStorage.setItem('my_note', JSON.stringify(my_arr))

    }

    async editItem() {
        let my_arr = this.state.arr
        let edit_item = my_arr[this.state.use_index]

        edit_item.header = this.state.new_header
        edit_item.note = this.state.new_note

        my_arr[this.state.use_index] = edit_item

        this.setState({ arr: my_arr })

        await AsyncStorage.setItem('my_note', JSON.stringify(my_arr))

    }

    addImg() {
        ImagePicker.openPicker({
            freeStyleCropEnabled: true,
            cropping: true,
        }).then(image => {
            this.setState({ new_img: image.path, img_action: true })
        })
    }

    cameraFun() {
        ImagePicker.openCamera({
            freeStyleCropEnabled: true,
            cropping: true,
        }).then(image => {
            this.setState({ new_img: image.path, img_action: true })
        })
    }

    render() {

        const myFilter = this.state.arr.filter((subject) => {
            return subject.header.indexOf(this.state.search_value) >= 0
        })

        return (
            <>
                <StatusBar barStyle='light-content' backgroundColor={'#3A1D92'} />
                <View
                    style=
                    {{
                        flex: 1,
                        backgroundColor: this.state.mood == true ? 'black' : 'white'
                    }}>

                    <Appbar.Header>
                        <Appbar.Content title="Note" />
                        <View style={{ flexDirection: 'row' }}>
                            <TextInput
                                style=
                                {{
                                    backgroundColor: '#DDD',
                                    width: 150,
                                    height: 30,
                                    borderRadius: 10,
                                    padding: 5,
                                    color: "#000",
                                }}
                                placeholder='search...'
                                placeholderTextColor={'gray'}
                                value={this.state.search_value}
                                onChangeText={(value) => {
                                    this.setState({ search_value: value })
                                }}
                            />
                            <TouchableOpacity
                                style={{
                                    position: 'absolute',
                                    bottom: 5,
                                    right: 5,
                                }}
                                onPress={() => {
                                    this.setState({ search_value: '' })
                                }}
                            >
                                <AntDesign
                                    name={this.state.search_value == '' ? 'search1' : 'close'}
                                    size={18}
                                    color={'black'}
                                />
                            </TouchableOpacity>

                        </View>

                        <Appbar.Action
                            icon={'circle'}
                            size={35}
                            color={this.state.mood == true ? 'black' : 'white'}
                            onPress={() => {
                                if (this.state.mood == true) {
                                    this.setState({ mood: false })
                                }
                                else {
                                    this.setState({ mood: true })
                                }
                            }}
                        />

                    </Appbar.Header>

                    <FlatList
                        data={myFilter}
                        ListEmptyComponent={() => {
                            return (
                                <>
                                    <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 30 }}>
                                        {/* <Icon name='plus-circle' size={50} color={'black'} /> */}
                                        <Text style={{ color: 'gray', fontSize: 16, fontWeight: 'bold' }}>There is no item</Text>
                                    </View>
                                </>
                            )
                        }}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => {
                            return (
                                <>
                                    <TouchableOpacity
                                        style=
                                        {{
                                            width: '95%',
                                            height: 130,
                                            alignSelf: 'center',
                                            marginVertical: 10,
                                            borderRadius: 20,
                                            borderWidth: 2,
                                            borderColor: this.state.mood == true ? 'white' : 'black',
                                            backgroundColor: this.state.mood == true ? 'white' : 'black'

                                        }}
                                        onLongPress={() => {
                                            this.deleteItem(index)
                                        }}
                                        onPress={() => {
                                            this.setState({
                                                visible_modal: true,
                                                new_header: item.header,
                                                new_note: item.note,
                                                use_index: index,
                                                saveAction: false,
                                            })
                                        }}
                                    >
                                        <View
                                            style=
                                            {{
                                                borderBottomColor: 'black',
                                                borderBottomWidth: 1,
                                                padding: 5,
                                                backgroundColor: '#ddd',
                                                borderTopLeftRadius: 20,
                                                borderTopRightRadius: 20,
                                            }}
                                        >
                                            <Text style={{ color: 'black', fontSize: 20, fontWeight: 'bold' }}> {item.header} </Text>
                                        </View>
                                        <View style={{ padding: 10 }}>
                                            <Text
                                                style=
                                                {{
                                                    color: this.state.mood == true ? 'black' : 'white',
                                                    fontSize: 18,
                                                }}
                                                numberOfLines={3}
                                            >
                                                {item.note}
                                            </Text>
                                        </View>

                                    </TouchableOpacity>
                                </>
                            )
                        }}
                    />


                    <TouchableOpacity
                        style=
                        {{
                            height: 50,
                            width: 50,
                            borderRadius: 25,
                            backgroundColor: "#FFDB00",
                            position: 'absolute',
                            bottom: 30,
                            right: 30,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        onPress={() => {
                            this.setState({ visible_modal: true, saveAction: true, })
                        }}
                    >
                        <Text style={{ fontSize: 25, fontWeight: "bold", color: '#000' }}>+</Text>
                    </TouchableOpacity>

                    <Modal
                        visible={this.state.visible_modal}
                        onRequestClose={() => {
                            this.setState({
                                visible_modal: false,
                                new_header: '',
                                new_note: '',
                            })
                        }}
                    >
                        <View style={{ flex: 1, backgroundColor: this.state.mood == true ? 'black' : 'white' }}>

                            <Appbar.Header>
                                <Appbar.BackAction
                                    onPress={() => {
                                        this.setState({
                                            visible_modal: false,
                                            new_header: '',
                                            new_note: '',
                                        })
                                    }}
                                />
                                <Appbar.Content title="Add note" />
                                <TouchableOpacity
                                    onPress={() => {
                                        if (this.state.saveAction == true) {
                                            this.addItem()
                                        }
                                        else {
                                            this.editItem()
                                        }
                                    }}
                                >
                                    <Icon name='save' size={25} color={'white'} />
                                </TouchableOpacity>

                                <Appbar.Action
                                    icon={'circle'}
                                    size={35}
                                    color={this.state.mood == true ? 'black' : 'white'}
                                    onPress={() => {
                                        if (this.state.mood == true) {
                                            this.setState({ mood: false })
                                        }
                                        else {
                                            this.setState({ mood: true })
                                        }
                                    }}
                                />

                            </Appbar.Header>

                            {
                                this.state.img_action && (
                                    <TouchableOpacity
                                        onLongPress={() => {
                                            this.setState({ img_action: false })
                                        }}
                                    >
                                        <Image
                                            source={{ uri: this.state.new_img }}
                                            resizeMode={'contain'}
                                            style=
                                            {{
                                                height: 250,
                                                width: 300,
                                            }}
                                        />
                                    </TouchableOpacity>
                                )
                            }

                            <View>
                                <TextInput
                                    style=
                                    {{
                                        backgroundColor: this.state.mood == true ? 'black' : 'white',
                                        width: '100%',
                                        height: 60,
                                        borderBottomWidth: 1,
                                        borderBottomColor: "gray",
                                        padding: 10,
                                        fontSize: 20,
                                        color: this.state.mood == true ? 'white' : 'black'
                                    }}
                                    placeholder='header'
                                    placeholderTextColor={'gray'}
                                    value={this.state.new_header}
                                    onChangeText={(value) => {
                                        this.setState({ new_header: value })
                                    }}
                                />
                            </View>

                            <View >
                                <TextInput
                                    style=
                                    {{
                                        backgroundColor: this.state.mood == true ? 'black' : '#fff',
                                        width: '100%',
                                        padding: 10,
                                        fontSize: 20,
                                        color: this.state.mood == true ? 'white' : 'black',
                                        justifyContent: 'flex-start',
                                        alignItems: 'flex-start',
                                    }}

                                    placeholder='note'
                                    placeholderTextColor={'gray'}
                                    multiline={true}
                                    value={this.state.new_note}
                                    onChangeText={(value) => {
                                        this.setState({ new_note: value })
                                    }}
                                />
                            </View>

                            <FAB.Group
                                open={this.state.my_fba.open}
                                icon={this.state.my_fba.open == true ? 'calendar-today' : 'plus'}
                                actions={[

                                    {
                                        icon: 'camera',
                                        label: 'camera',
                                        onPress: () => {
                                            this.cameraFun()
                                        },

                                    },
                                    {
                                        icon: 'image',
                                        label: 'image',
                                        onPress: () => {
                                            this.addImg()
                                        },
                                    }
                                ]}
                                onStateChange={(open) => {
                                    this.setState({ my_fba: open })
                                }}
                                onPress={() => {
                                    if (this.state.my_fba.open) {
                                        // do something if the speed dial is open
                                    }
                                }}
                            />
                        </View>


                    </Modal>

                </View>
            </>
        )
    }
}

