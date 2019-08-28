import React from 'react';
import {Image, ImageBackground, Platform, StyleSheet, Text, View} from 'react-native';
import AvatarGroup from './AvatarGroup';

export interface User {
    code: number
    name: string
    avatar?: string
}

export interface Props {
    /**
     * 员工，如果users有值则无效
     */
    user: User
    /**
     * 群头像员工列表，优先于user属性
     */
    users: User[]
    /**
     * 视图大小，正六边形的直径
     */
    size: number
    /**
     * 分隔线宽度
     */
    sepWidth: number
    /**
     * 默认头像背景色
     */
    colors: string[]
    /**
     * 自定义头像绘制方法
     * @param {User} user
     * @returns {React.Element}
     */
    renderAvatar: (user: User) => React.Element
    /**
     * 缩略图
     * @param {string} url
     * @returns {string}
     */
    getThumbUrl: (url: string) => string
    /**
     * 正多边形边数，默认6
     */
    numberOfSides: number
    /**
     * 是否使用边框
     */
    borderEnable: boolean
    border: {
        innerBorderWidth: number
        innerBorderColor: string
        outerBorderWidth: number
        defOuterBorderColors: string[]
        imageBorderColor: string
        borderSpace: number
    }
}

export default class AvatarImage extends React.PureComponent<Props> {
    static defaultProps = {
        colors: ['#3EAAFF', '#47C2E7', '#FD6364', '#FDC63F', '#BEE15D', '#28D9C1', '#FF9D50'],
        size: 48,
        radius: 2,
        sepWidth: 1,
        users: [],
        numberOfSides: 6,
        rotate: 0,
        borderEnable: false,
        border: {
            innerBorderWidth: StyleSheet.hairlineWidth,
            innerBorderColor: '#FFFFFF',
            outerBorderWidth: 2,
            defOuterBorderColors: ['#FFE4CD','#CBE7FF','#DAF6FF','#FFE1E1','#E6F5BE','#D3F9F4','#FCF1D8'],
            imageBorderColor: '#F1F1F1',
            borderSpace: 5
        },
    };

    static getDerivedStateFromProps(nextProp) {
        return AvatarImage.convertProp(nextProp);
    }

    static convertProp({users, user}) {
        let stateUsers;
        if (users.length === 0 && user) {
            stateUsers = [user];
        } else if (users.length > 4) {
            stateUsers = [...users];
            stateUsers.length = 4;
        } else {
            stateUsers = users;
        }
        return {users: stateUsers};
    }

    constructor(props) {
        super(props);
        this.state = AvatarImage.convertProp(props)
    }

    getThumbUrl = (url) => {
        return url;
    };

    getUserText = (user) => {
        let text;
        if (/[\u4e00-\u9fa5]/.test(user.name)) {
            const matchs = user.name.match(/[\u4e00-\u9fa5]/g);
            text = matchs[matchs.length - 1];
        } else {
            text = user.name.charAt(0).toUpperCase();
        }
        return text || '?';
    };

    getFillColor = (user, colors) => {
        return colors[Number(user.code) % colors.length];
    };

    borderWapper = () => {
        const {size, colors, style, renderAvatar = this.renderDefaultAvatar} = this.props;
        const {users} = this.state;
        const fristUser = users && users.length > 0 && users[0];
        if (!fristUser) {
            return <View />;
        }
        const colorName = this.getFillColor(fristUser, colors);
        const source = fristUser.avatar ? require('./image/gray.png') : textBorder[colorName];
        return (
            <ImageBackground source={source} style={[style]}>
                <AvatarGroup {...this.props} style={[{width: size, height: size, margin: 13}]}>
                    {users.map(renderAvatar)}
                </AvatarGroup>
            </ImageBackground>
        );
    };

    renderDefaultAvatar = (user, index) => {
        const {size, colors, getThumbUrl = this.getThumbUrl} = this.props;
        const {users} = this.state;
        if (user.avatar) {
            const {fontWeight, fontSize, lineHeight, ...others} = AvatarImage.getTextStyle(size, users.length, index);
            return (
                <Image key={index} style={others} source={{uri: getThumbUrl(user.avatar)}} />
            );
        } else {
            return (
                <Text key={index} style={[{
                    color: 'white',
                    backgroundColor: colors[Number(user.code) % colors.length],
                    textAlign: 'center',
                    textAlignVertical: 'center',
                }, AvatarImage.getTextStyle(size, users.length, index)]}>
                    {this.getUserText(user)}
                </Text>
            );
        }
    };

    static getTextStyle(size, count, index) {
        let fontSize, paddingLeft = 0, paddingRight = 0, paddingTop = 0, paddingBottom = 0, width, height, top, left,
            right, bottom, fontWeight, position = 'absolute', lineHeight;
        const padding = size / 2 * (1 - Math.sin(Math.PI * 2 / 6));
        if (count === 1) {
            fontSize = size / 3;
            fontWeight = 'bold';
            width = size;
            height = size;
        } else if (count === 2) {
            fontSize = size / 3;
            width = size / 2;
            height = size;
            if (index === 0) {
                paddingLeft = padding;
                left = 0;
            } else {
                paddingRight = padding;
                right = 0;
            }
        } else if (count === 3) {
            fontWeight = 'bold';
            fontSize = size * 10 / 48;
            if (index === 0) {
                width = size / 2;
                height = size * 0.75;
                left = 0;
                paddingLeft = padding
            } else if (index === 1) {
                width = size / 2;
                height = size * 0.75;
                right = 0;
                paddingRight = padding
            } else {
                width = size;
                height = size / 2;
                bottom = 0;
            }
        } else {
            fontWeight = 'bold';
            fontSize = size * 10 / 48;
            width = size / 2;
            height = size / 2;
            if (index % 2 === 0) {
                paddingLeft = padding;
                left = 0;
            } else {
                paddingRight = padding;
                right = 0;
            }
            if (index < 2) {
                paddingTop = size / 8;
                lineHeight = size / 3;
                top = 0;
            } else {
                paddingBottom = size / 8;
                lineHeight = size / 3;
                bottom = 0;
            }
        }
        lineHeight = Platform.OS === 'ios' ? lineHeight || height : undefined;
        return {
            position,
            fontWeight,
            fontSize,
            paddingRight,
            paddingLeft,
            paddingTop,
            paddingBottom,
            width,
            height,
            lineHeight,
            top,
            left,
            bottom,
            right
        }
    }

    render() {
        const {size, style, renderAvatar = this.renderDefaultAvatar} = this.props;
        const {users} = this.state;
        return (
            <AvatarGroup {...this.props} style={[{width: size, height: size}, style]}>
                {users.map(renderAvatar)}
            </AvatarGroup>
        );
    }
}