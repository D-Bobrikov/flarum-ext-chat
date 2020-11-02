import Button from 'flarum/components/Button';

import ChatModal from './ChatModal';
import Stream from 'flarum/utils/Stream';

export default class ChatEditModal extends ChatModal
{
	oninit(vnode)
	{
		super.oninit(vnode);

		this.getInput().title = Stream(this.model.title());
		this.getInput().color = Stream(this.model.color());
		this.getInput().icon = Stream(this.model.icon());

		this.setSelectedUsers(this.model.users());
	}

	title() 
	{
		return app.translator.trans('pushedx-chat.forum.chat.edit_modal.title');
	}

	onsubmit()
	{
		let added = this.getSelectedUsers().map(mdl => !this.model.users().includes(mdl) ? mdl : null).filter(e => e);
		let removed = this.model.users().map(mdl => !this.getSelectedUsers().includes(mdl) ? mdl : null).filter(e => e);

		this.model.save({
			title: this.getInput().title(),
			color: this.getInput().color(),
			icon: this.getInput().icon(),
			relationships: {added, removed}
		});
		this.model.pushData({relationships: {users: this.getSelectedUsers()}});

		this.hide();
	}

	alertText()
	{
		return null;
	}

	userMentionClassname(user)
	{
		return 'editable';
	}

	userMentionOnClick()
	{
		// Переделать под мини дропдаун для выдачи прав или исключения/добавления в чат. При исключении перечеркивать mention
	}

	componentFormInputIcon()
	{
		return this.componentFormIcon({
			title: app.translator.trans('pushedx-chat.forum.chat.edit_modal.form.icon'),
			desc: app.translator.trans('pushedx-chat.forum.chat.edit_modal.form.icon.validator', {a: <a href="https://fontawesome.com/icons?m=free" tabindex="-1" />}),
			stream: this.getInput().icon,
			placeholder: 'fas fa-bolt'
		});
	}

	componentFormInputTitle()
	{
		return this.componentFormInput({
			title: app.translator.trans('pushedx-chat.forum.chat.edit_modal.form.title'),
			desc: app.translator.trans('pushedx-chat.forum.chat.edit_modal.form.title.validator'),
			stream: this.getInput().title,
			placeholder: app.translator.trans('pushedx-chat.forum.chat.edit_modal.form.title')
		});
	}

	componentFormInputColor()
	{
		return this.componentFormColor({
			title: app.translator.trans('pushedx-chat.forum.chat.edit_modal.form.color'),
			desc: app.translator.trans('pushedx-chat.forum.chat.edit_modal.form.color.validator'),
			stream: this.getInput().color,
			placeholder: app.translator.trans('pushedx-chat.forum.chat.edit_modal.form.color')
		});
	}

	componentFormPM()
	{
		return [

		];
	}

	componentFormChannel()
	{
		return [
			this.componentFormInputTitle(),
			this.componentFormInputColor(),
			this.componentFormInputIcon()
		];
	}

	componentFormChat()
	{
		return [
			this.componentFormInputTitle(),
			this.componentFormInputColor(),
			this.componentFormInputIcon(),
			this.componentFormUsersSelect()
		];
	}

	componentForm()
	{
		if(this.model.type()) return this.componentFormChannel();
		if(this.model.users().length == 2) return this.componentFormPM();
		
		return this.componentFormChat();
	}

	content() {
		return (
			<div className="Modal-body Modal-body--neonchat">
				<div class="Form-group InputTitle">
					{this.componentForm()}
					<Button
						className='Button Button--primary Button--block ButtonCreate'
						onclick={this.onsubmit.bind(this)}
						disabled={this.model.type() ? !this.isCanCreateChannel() : !this.isCanCreateChat()}
					>
						{app.translator.trans('pushedx-chat.forum.chat.edit_modal.save_button')}
					</Button>
				</div>
			</div>
		);
	}
}