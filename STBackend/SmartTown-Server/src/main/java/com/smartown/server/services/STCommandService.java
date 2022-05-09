package com.smartown.server.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smartown.server.model.STCommand;
import com.smartown.server.model.repository.STCommandRepository;


@Service
public class STCommandService implements ISTCommandService{

	
	@Autowired
	private STCommandRepository repository;
	
	@Override
	public List<STCommand> getAllCommands() {
		List<STCommand> list = (List<STCommand>) repository.findAll();
		if(list.size()>0)
		{
			return list;
		}
		return null;
	}

	@Override
	public STCommand createCommand(STCommand command) {
		return repository.save(command);
	}

}
