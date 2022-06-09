package com.smartown.server.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smartown.server.model.STBaseAction;
import com.smartown.server.model.repository.STBaseActionRepository;


@Service
public class STBaseActionService implements ISTBaseActionService{

	
	@Autowired
	private STBaseActionRepository repository;
	
	@Override
	public List<STBaseAction> getAllBaseActions() {
		List<STBaseAction> list = (List<STBaseAction>) repository.findAll();
		if(list.size()>0)
		{
			return list;
		}
		return null;
	}

	@Override
	public STBaseAction createBaseAction(STBaseAction command) {
		command.setCustom(true);
		return repository.save(command);
	}

	@Override
	public List<STBaseAction> getAllCustomBaseActions() {
		List<STBaseAction> list = (List<STBaseAction>) repository.findAllByCustom(true);
		if(list.size()>0)
		{
			return list;
		}
		return null;
	}

	@Override
	public List<STBaseAction> getAllFixedBaseActions() {
		List<STBaseAction> list = (List<STBaseAction>) repository.findAllByCustom(false);
		if(list.size()>0)
		{
			return list;
		}
		return null;
	}

	@Override
	public STBaseAction getBaseActionFromName(String name) {
		STBaseAction action = repository.findByName(name);
		return action;
	}

}
