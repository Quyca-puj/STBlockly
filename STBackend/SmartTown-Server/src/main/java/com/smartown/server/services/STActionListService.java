package com.smartown.server.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smartown.server.model.STActionList;
import com.smartown.server.model.STCommand;
import com.smartown.server.model.repository.STActionListRepository;
import com.smartown.server.model.repository.STCommandRepository;


@Service
public class STActionListService implements ISTActionListService{

	
	@Autowired
	private STActionListRepository repository;
	
	@Override
	public List<STActionList> getAllActionLists() {
		List<STActionList> list = (List<STActionList>) repository.findAll();
		if(list.size()>0)
		{
			return list;
		}
		return null;
	}

	@Override
	public STActionList createActionList(STActionList aList) {
		return repository.save(aList);
	}

}
