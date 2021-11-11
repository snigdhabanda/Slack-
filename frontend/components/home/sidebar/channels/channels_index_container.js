import { connect } from "react-redux"
import { createChannel, fetchChannels, fetchChannel } from "../../../../actions/channel_actions"
import ChannelsIndex from "./channels_index"
import {createChannelMember} from '../../../../actions/channel_member_actions'
import { createMessage, removeMessage } from "../../../../actions/messages_actions"
import { getTime } from "../../../../actions/messages_actions"

const mapStateToProps = (state) => ({
    channels: state.entities.channels,
    currentUser: state.session.id,
    currentView: state.currentView.channelId,
    messages: state.entities.messages,
    users: state.entities.users,
    dynamicView: state.currentView
    
})

const mapDispatchToProps = (dispatch) => ({
    fetchChannel: (channelId) => dispatch(fetchChannel(channelId)),
    fetchChannels: () => dispatch(fetchChannels()),
    createChannel: (channel) => dispatch(createChannel(channel)),
    createMessage: (message) => dispatch(createMessage(message)),
    getTime: (messageId) => dispatch(getTime(messageId)),
    removeMessage: (message) => dispatch(removeMessage(message)),
    createChannelMember: (channelMember) => dispatch(createChannelMember(channelMember))
})

export default connect(mapStateToProps, mapDispatchToProps)(ChannelsIndex)