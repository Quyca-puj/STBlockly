package com.smartown.server.services;

import java.util.List;

import com.smartown.server.model.STActionList;
import com.smartown.server.model.STCommand;

public interface ISTActionListService {
	
	List<STActionList> getAllActionLists();
	
	STActionList createActionList(STActionList aList);

}
