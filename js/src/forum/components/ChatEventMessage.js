import ChatMessage from './ChatMessage';
import Link from 'flarum/components/Link';
import extractText from 'flarum/utils/extractText';
import humanTime from 'flarum/utils/humanTime';
import fullTime from 'flarum/helpers/fullTime';

export default class ChatEventMessage extends ChatMessage
{
	oninit(vnode)
	{
		super.oninit(vnode);

		if(this.model.message()[0] == '*') this.parsedContent = {id: 'chatCensored'}
		else this.parsedContent = JSON.parse(this.model.message());
	}

	componentUserMention(user)
	{
		return (
			<Link href={app.route.user(user)}>
				<span className='UserMention'>{user.displayName()}</span>
			</Link>
		);
	}

	componentEventText()
	{
		switch(this.parsedContent.id)
		{
			case 'chatCensored':
			{
				return <div className='censored'>{this.model.message()}</div>
			}
			case 'chatCreated':
			{
				let transKey = 'chat';
				if(this.parsedContent.users.length == 1) transKey = 'pm';
				else if(this.model.chat().type() == 1) transKey = 'channel';

				return app.translator.trans(`pushedx-chat.forum.chat.message.events.${transKey}.created`, {
					creatorname: this.componentUserMention(this.model.user()), 
					chatname: <b className='chat-title'>{this.model.chat().title()}</b>,
					usernames: this.parsedContent.users.map(user_id => this.componentUserMention(app.store.getById('users', user_id))),
					username: this.parsedContent.users.length ? this.componentUserMention(app.store.getById('users', this.parsedContent.users[0])) : null
				});
			}
			case 'chatEdited':
			{
				let componentOld, componentNew;
				switch(this.parsedContent.column)
				{
					case 'title':
						componentOld = <b className='chat-title'>{this.parsedContent.old}</b>;
						componentNew = <b className='chat-title'>{this.parsedContent.new}</b>;
						break;

					case 'color':
						componentOld = <i className='fas fa-circle' style={{color: this.parsedContent.old}}></i>;
						componentNew = <i className='fas fa-circle' style={{color: this.parsedContent.new}}></i>;
						break;

					case 'icon':
						componentOld = this.parsedContent.old ? <i className={this.parsedContent.old}></i> : <b>[nothing]</b>;
						componentNew = <i className={this.parsedContent.new}></i>;
						break;
				}
			
				return app.translator.trans(`pushedx-chat.forum.chat.message.events.${this.parsedContent.column}.edited`, {
					editorname: this.componentUserMention(this.model.user()),
					old: componentOld,
					new: componentNew
				});
			}
		}
	}

	content()
	{
		return (
			<div className='event'>
				{this.componentEventText()}
				<a className='timestamp' title={extractText(fullTime(this.model.created_at()))}>{this.humanTime = humanTime(this.model.created_at())}</a>
			</div>
		);
	}
}