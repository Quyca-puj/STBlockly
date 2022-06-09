package com.smartown.server.services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smartown.server.model.STActionList;
import com.smartown.server.model.dto.STActionListDTO;
import com.smartown.server.model.repository.STActionListRepository;


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
		STActionList list = repository.save(aList);
		if(list.getActionList()==null) {
			list.setActionList(new ArrayList<>());
		}
		return list;
	}
	
	
	public STActionList createFromDTO(STActionListDTO in) {
		STActionList list = new STActionList();
		list.setName(in.getName());
		return list;
	}

	@Override
	public STActionList updateActionList(STActionList newAList) {
		
		return repository.save(newAList);
	}

}
