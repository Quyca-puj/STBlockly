package com.smartown.server.services;

import java.util.List;

import com.smartown.server.model.STCommand;

public interface ISTCommandService {
	
	List<STCommand> getAllCommands();
	
	STCommand createCommand(STCommand command);

}
