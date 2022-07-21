package com.smartown.server.model.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.smartown.server.model.STBaseAction;
import com.smartown.server.model.STInstanceAction;

@Repository
public interface STInstanceActionRepository extends CrudRepository<STInstanceAction, Long>{
}
