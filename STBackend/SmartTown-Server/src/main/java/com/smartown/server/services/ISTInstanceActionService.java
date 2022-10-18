package com.smartown.server.services;

import java.util.List;

import com.smartown.server.model.STBaseAction;
import com.smartown.server.model.STInstanceAction;
import com.smartown.server.model.dto.ActionDTO;
/*
 * Emotion Service
 * @author IQBots
 */
public interface ISTInstanceActionService {

	List<STInstanceAction> getAllInstanceActions();

	STInstanceAction createInstanceAction(ActionDTO command, STBaseAction baseAction);

	STInstanceAction persistInstanceAction(STInstanceAction command);

	ActionDTO createActionfromInstance(STInstanceAction action);
}
