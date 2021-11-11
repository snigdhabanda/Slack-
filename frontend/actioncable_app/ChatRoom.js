import React from "react";
import MessageForm from "./MessageForm.js";
import EditMessageForm from "./EditMessageForm"
import {getTime} from '../util/message_api_util'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHashtag, faSortDown, faPlus, faReply, faTrashAlt, faEdit} from '@fortawesome/fontawesome-free-solid'
import Thread from './Thread'
import ChannelForm from './../components/home/sidebar/channels/channel_form'
import AddChannelMembers from "../components/home/sidebar/channels/add_channel_members.jsx";



class ChatRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = { messages: [], threadMessages: [], updatingMessage: false, replying: false, displayForm: false, submittingMessage: false, memberIds: []};
    this.bottom = React.createRef();
    this.channelQueue = [];
    
  }
  
  subscribeToChannel() {
    App.cable.subscriptions.create(
      { channel: "ChatChannel",
        id: this.props.currentView
    },
      {
        received: data => {
          switch (data.type) {
            case "createMessage":
                const message = {
                id: data.id,
                body: data,
                authorId: data.author_id,
                channelId: data.channel_id,
                createdAt: data.created_at  
                }
                this.props.createMessage(message) 
                this.setState({
                  messages: this.props.messages.reverse()
                });
            case "editMessage":
              const editedMessage = {
                id: data.id,
                body: data.message,
                authorId: data.author_id,
                channelId: data.channel_id,
                createdAt: data.created_at  
                }
            case "deleteMessage":
              console.log(data.type)
              this.props.deleteMessage(data.message)
              this.setState({
                messages: this.props.messages.reverse()
              });
            case "replyMessage":
              
                const replyMessage = {
                id: data.id,
                body: data.message,
                authorId: data.author_id,
                channelId: data.channel_id,
                createdAt: data.created_at,
                parentMessageId: data.parent_message_id  
                }
                console.log(replyMessage)
                this.props.createMessage(replyMessage) 
                let thread = this.state.threadMessages.slice().concat(replyMessage)
                this.setState({
                  threadMessages: thread
                })

          }
        },
        speak: function(data) {return this.perform("speak", data)},
        update: function(data) {return this.perform("update", data)},
        delete: function(data) {return this.perform("delete", data)},
        reply: function(data) {return this.perform("reply", data)}
      }
    )
    
  }
  
  componentDidUpdate(prevProps){
    if (prevProps.channels !== this.props.channels){
      this.setState({submittingMessage: true})
    }
  }

  unsubscribeFromChannel(){
    App.cable.disconnect()
  }
  

  loadMessages() {
    const messages = this.props.messages.reverse()
    this.setState({ messages: messages });
  }

  changeChannel(channelId) {
    //unsubscribe from previous channel 
    this.unsubscribeFromChannel()
    //calling RECEIVE_CHANNEL for viewreducer && loading messages
    this.props.fetchChannel(channelId).then(() => this.loadMessages()) 
    // this.loadMessages()
    this.subscribeToChannel()
  }

  // getTime(messageId){
  //   console.log("gettingtime")
  //   getTime(messageId);
  // }

  updateMessage(message){
    this.setState({updatingMessage: true})
    this.messageToUpdate = message; 
    
  }

  deleteMessage(message){
    console.log("deleting message")
    App.cable.subscriptions.subscriptions[0].delete({ message: message});
  }

  reply(message){
    this.setState({replying: true})
    this.replyMessage = message
  }

  handleClick(e){
    e.preventDefault()
    if (!this.state.displayForm) {this.setState({displayForm: true})}

}
  
  render() {
    console.log(this.state.submittingMessage)
    if (this.channelQueue.length === 0 || this.channelQueue[this.channelQueue.length - 1] !== this.props.currentView){
      this.channelQueue.push(this.props.currentView)
      this.changeChannel(this.props.currentView)
    }
    
    const messageList = this.state.messages.map((message, idx) => {
      let timeStampArray = new Date(`${message.createdAt}`).toLocaleString().split(" ")
      let timestamp = timeStampArray[1].slice(0,timeStampArray[1].length - 3) + " " + timeStampArray[2].toLowerCase()
      
      let numReplies = this.props.messages.filter(stateMessage => stateMessage.parentMessageId === message.id).length
      if (!message.parentMessageId){
      return (
        <li className="message-box" key={message.id}>
          <div className="message-author">{this.props.users[message.authorId].displayName}
            <p className="message-time">{timestamp}</p>
          </div>
          <p className="message-content">{message.body}</p>
          <div onClick={this.reply.bind(this, message)} className="replies">{numReplies > 0 ? numReplies === 1  ?  `${numReplies} reply` : `${numReplies} replies` : ""}</div>
          
          {(this.state.updatingMessage && this.messageToUpdate.id === message.id) ? 
            <div><EditMessageForm 
            currentUser={this.props.currentUser} 
            channelId={this.props.currentView} 
            message={this.messageToUpdate} />{this.state.updatingMessage = false}
            </div>: ""
          }
          
          <div className="edit-delete-reply">
            <button className="update-message" onClick={this.updateMessage.bind(this, message)}>
              <FontAwesomeIcon className="edit-icon" icon={faEdit} />
            </button>
            <button className="delete-message" onClick={this.deleteMessage.bind(this, message)}>
              <FontAwesomeIcon className="trash-icon" icon={faTrashAlt} />
            </button>
            <button className="reply-message" onClick={this.reply.bind(this, message)}>
              <FontAwesomeIcon className="reply-icon" icon={faReply} />
            </button>
          </div>
          
        </li>
        

      )};
    });
    return (
      <div className="channels-messages">
        <div className="channel-title">
            <div className="channel-arrow-container"><FontAwesomeIcon className="channel-arrow" icon={faSortDown} /> </div>
            Channels       
           <FontAwesomeIcon onClick={this.handleClick.bind(this)} className="channel-plus" icon={faPlus} />
        </div>

        
        <ul className="channels-list">
        {Object.values(this.props.channels).filter(channel => !channel.dm).map((channel) =>(
              <li className="channel" onClick={this.props.fetchChannel.bind(this, channel.id)}>
                <FontAwesomeIcon className="hashtag" icon={faHashtag} />
                {channel.name}
              </li>
        ))}
        </ul>
        
        
        <ul className="dms-list">
        <div className="dm-title">Direct Messages</div>
        {Object.values(this.props.channels).filter(channel => channel.dm).map((channel) =>(
              <li className="dm" onClick={this.props.fetchChannel.bind(this, channel.id)}>
                {channel.name}
              </li>
            
          ))}
          
        </ul>
        
        

        {this.state.displayForm ? 
                <div>
                    <ChannelForm memberIds={this.state.memberIds} createChannelMember={this.props.createChannelMember} channels={this.props.channels} users={this.props.users} currentView = {this.props.currentView} createChannel={this.props.createChannel} fetchChannel={this.props.fetchChannel}/>
                    {this.state.displayForm = false}
                </div>
                    
                : null}
        {/* <button onClick={this.handleClick.bind(this)}>New Channel</button> */}

        {this.state.submittingMessage ? 
                <div><AddChannelMembers createChannelMember = {this.props.createChannelMember} currentUser = {this.props.currentUser} currentView={this.props.currentView} memberIds={this.state.memberIds} />
                {this.state.submittingMessage = false}
                {this.state.memberIds = []}
                </div> : ""
                
        }
             
        
        <div className="messages-and-threads">
        <div className="message-list" >
          {this.props.channels && this.props.currentView ? 
          <div className="channel-name">
            {this.props.channels[this.props.currentView].name}
          </div> : ""}
          <div id="for-scroll">
          {messageList}
          </div>
        </div>

        {this.state.replying || this.state.threadMessages.length > 0 ? 
        <div className="thread">
            <Thread users={this.props.users} currentUser={this.props.currentUser} channels={this.props.channels} channelId={this.props.currentView} threadMessages={this.state.threadMessages} message={this.replyMessage} messages={this.props.messages}/>
            {this.state.threadMessages = []}
            {this.state.replying = false}
            
        </div> : ""
        }
        </div>
        <MessageForm currentUser={this.props.currentUser} channels={this.props.channels} channelId={this.props.currentView}/>
      </div>
    );
  }
}

export default ChatRoom;