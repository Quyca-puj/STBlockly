package com.smartown.server.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smartown.server.model.STBaseAction;
import com.smartown.server.model.STEmotionalAction;
import com.smartown.server.model.STInstanceAction;
import com.smartown.server.model.STTimedAction;
import com.smartown.server.model.dto.ActionDTO;
import com.smartown.server.model.repository.STInstanceActionRepository;


@Service
public class STInstanceActionService implements ISTInstanceActionService{

	
	@Autowired
	private STInstanceActionRepository repository;
	
	@Override
	public List<STInstanceAction> getAllInstanceActions() {
		List<STInstanceAction> list = (List<STInstanceAction>) repository.findAll();
		if(list.size()>0)
		{
			return list;
		}
		return null;
	}

	@Override
	public STInstanceAction persistInstanceAction(STInstanceAction action) {
		return repository.save(action);
	}

	@Override
	public STInstanceAction createInstanceAction(ActionDTO actionDto, STBaseAction baseAction) {
		ActionDTO.ActionDTOType type = actionDto.getActionType();
		System.out.println(actionDto);
		STInstanceAction action;
		switch(type) {
		case COMMAND:
			action = new STInstanceAction(actionDto,baseAction);
			break;
		case EMOTIONAL:
			action = new STEmotionalAction(actionDto, baseAction);
			break;
		case TIMED:
			action = new STTimedAction(actionDto, baseAction);
			break;
		default:
			action=null;
			break;
		}
		return persistInstanceAction(action);
	}
	
	@Override
	public ActionDTO createActionfromInstance(STInstanceAction action) {
		ActionDTO newAction = new ActionDTO();
		newAction.setAction(action.getBaseAction().getName());
		newAction.setShouldAnswer(action.getBaseAction().isShouldAnswer());
		if(action instanceof STEmotionalAction) {
			newAction.setEmotion(((STEmotionalAction)action).getEmotion());
		}else if(action instanceof STTimedAction) {
			newAction.setTime(((STTimedAction)action).getTime());
		}
		newAction.setSpeed(action.getSpeed());
		return newAction;
		
	}


}
