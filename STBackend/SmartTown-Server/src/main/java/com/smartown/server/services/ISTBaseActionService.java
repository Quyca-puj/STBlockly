package com.smartown.server.services;

import java.util.List;

import com.smartown.server.model.STBaseAction;
/*
 * Emotion Service
 * @author IQBots
 */
public interface ISTBaseActionService {

	List<STBaseAction> getAllBaseActions();

	List<STBaseAction> getAllCustomBaseActions();

	List<STBaseAction> getAllFixedBaseActions();

	STBaseAction createBaseAction(STBaseAction command);

	STBaseAction getBaseActionFromName(String name);

}
