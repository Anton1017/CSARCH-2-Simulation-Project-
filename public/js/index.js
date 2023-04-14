$(document).ready(function(){
	document.getElementById("cache_hit").setAttribute('readonly', true);
	document.getElementById("cache_miss").setAttribute('readonly', true);
	document.getElementById("miss_penalty").setAttribute('readonly', true);
	document.getElementById("average_memory").setAttribute('readonly', true);
	document.getElementById("total_memory").setAttribute('readonly', true);
	document.getElementById("snapshot").setAttribute('readonly', true);
	document.getElementById("gen_text").setAttribute('readonly', true);

    var input = {
        block_size: "",
        set_size: "",
        MM_memory_size: "",
        MM_size_type: "",
        cache_memory_size: "",
        cache_size_type: "",
        cache_cycle_time: "",
        memory_cycle_time: "",
        program_flow: "",
        program_flow_type: ""
    }

	function downloadTxt(){
		var blob = new Blob([document.getElementById("gen_text").innerHTML], {
			type: "text/plain;charset=utf-8;",
		});
		saveAs(blob, "result.txt");
	}

    function getInput(obj){
        obj.block_size = document.getElementById("block_size").value;
        obj.set_size = document.getElementById("set_size").value;
        obj.MM_memory_size = document.getElementById("MM_memory_size").value;
        obj.MM_size_type = document.getElementById("MM_size_type").value;
        obj.cache_memory_size = document.getElementById("cache_memory_size").value;
        obj.cache_size_type = document.getElementById("cache_size_type").value;
        obj.cache_cycle_time = document.getElementById("cache_cycle_time").value;
        obj.memory_cycle_time =  document.getElementById("memory_cycle_time").value;
        obj.program_flow = document.getElementById("program_flow").value;
        obj.program_flow_type = document.getElementById("program_flow_type").value;
    }

	function setOutput(obj){
		document.getElementById("cache_hit").setAttribute('readonly', false);
		document.getElementById("cache_miss").setAttribute('readonly', false);
		document.getElementById("miss_penalty").setAttribute('readonly', false);
		document.getElementById("average_memory").setAttribute('readonly', false);
		document.getElementById("total_memory").setAttribute('readonly', false);
		document.getElementById("snapshot").setAttribute('readonly', false);
		document.getElementById("gen_text").setAttribute('readonly', false);

		document.getElementById("cache_hit").value = obj.num_cache_hits
		document.getElementById("cache_miss").value = obj.num_cache_misses
		document.getElementById("miss_penalty").value = obj.miss_penalty
		document.getElementById("average_memory").value = obj.average_memory_access_time
		document.getElementById("total_memory").value = obj.total_memory_access_time
		document.getElementById("snapshot").innerHTML = obj.cache_memory_snapshot

		var genTxt = "";
		genTxt = genTxt.concat(	"Cache hits: ", obj.num_cache_hits, "\n",
						"Cache misses: ", obj.num_cache_misses, "\n",
						"Miss penalty: ", obj.miss_penalty, "\n",
						"Average memory access time: ", obj.average_memory_access_time, "\n",
						"Total memory access time: ", obj.total_memory_access_time, "\n",
						"\n",
						"Cache memory snapshot:", "\n",
						obj.cache_memory_snapshot
		);
		// console.log(genTxt);
		document.getElementById("gen_text").innerHTML = genTxt;
		
		document.getElementById("cache_hit").setAttribute('readonly', true);
		document.getElementById("cache_miss").setAttribute('readonly', true);
		document.getElementById("miss_penalty").setAttribute('readonly', true);
		document.getElementById("average_memory").setAttribute('readonly', true);
		document.getElementById("total_memory").setAttribute('readonly', true);
		document.getElementById("snapshot").setAttribute('readonly', true);
		document.getElementById("gen_text").setAttribute('readonly', true);
	}

    function resetError(){
        document.getElementById("error").innerHTML = "";
    }

    function checkIfEmpty(obj){
        var keys = Object.keys(obj);
        var ifEmpty = false;
        keys.forEach((key, index) => {
            if(obj[key] == ""){
                ifEmpty = true;
            }
        });
        return ifEmpty;
    }

    function resetInput(){
        document.getElementById("block_size").value = "";
        document.getElementById("set_size").value= "";
        document.getElementById("MM_memory_size").value= "";
        document.getElementById("cache_memory_size").value= "";
        document.getElementById("cache_cycle_time").value= 1;
        document.getElementById("memory_cycle_time").value= 10;
        document.getElementById("program_flow").value= "";
    }

	function blockSetAssociativeMRU(input){
		var block_size = parseInt(input.block_size);
		var set_size = parseInt(input.set_size);
		var MM_memory_size = parseInt(input.MM_memory_size);
		var MM_size_type = input.MM_size_type;
		var cache_memory_size = parseInt(input.cache_memory_size);
		var cache_size_type = input.cache_size_type;
		var cache_cycle_time = parseInt(input.cache_cycle_time);
		var memory_cycle_time = parseInt(input.memory_cycle_time);
		var program_flow = input.program_flow.split(" ");
		var program_flow_type = input.program_flow_type;
		
		if (MM_size_type == "words") {
			MM_memory_size = MM_memory_size / block_size;
		}
	
		if (cache_size_type == "words") {
			cache_memory_size = cache_memory_size / block_size;
		}
		
		var num_cache_hits = 0;
		var num_cache_misses = 0;
		var miss_penalty = 0;
		var total_memory_access_time = 0;
		var no_of_sets = cache_memory_size / set_size;
		var cache_memory = new Array(no_of_sets);
	
		for (var i = 0; i < no_of_sets; i++) {
			console.log("Number of sets: " + no_of_sets);
			cache_memory[i] = [];
			for (var j = 0; j < set_size; j++) {
				cache_memory[i][j] = [];
			}
		}

		//convert to MM block if MM word address is given
		if(program_flow_type == "words"){
			program_flow.forEach((addr, index) => {
				program_flow[index] = Math.floor(addr / block_size);
			});
		}

		console.log("Program flow: ", program_flow, "\n");

		for (var i = 0; i < program_flow.length; i++) {
			var MM_block = parseInt(program_flow[i]);
			console.log("Program Flow Current Number: " + MM_block);
			
			
			var set_index = (MM_block) % no_of_sets;

			var hit = false;
	
			for (var j = 0; j < cache_memory[set_index].length; j++) {
				if (cache_memory[set_index][j].address == MM_block) {
					num_cache_hits++;
					hit = true;
					cache_memory[set_index][j].timeStamp = i;
					cache_memory[set_index][j].address = MM_block;
					break;
				}
			}

			if (!hit) {
				num_cache_misses++;
	
				if (cache_memory[set_index].length != 0) {
					var maxIndex = 0;
	
					for (var j = 0; j < cache_memory[set_index].length; j++) {
						if (cache_memory[set_index][j].timeStamp > cache_memory[set_index][maxIndex].timeStamp) {
							maxIndex = j;
						}
					}
					cache_memory[set_index].splice(maxIndex, 1);
				}

				cache_memory[set_index].push({
					timeStamp: i,
					address: MM_block
				});
			}
		}

		var hit_rate = num_cache_hits / (num_cache_hits + num_cache_misses);
		miss_penalty = (2 * cache_cycle_time) + (block_size * memory_cycle_time);
		var average_memory_access_time = (hit_rate * cache_cycle_time) + ((1 - hit_rate) * miss_penalty);
		total_memory_access_time = (num_cache_hits * cache_cycle_time * block_size) + (num_cache_misses * (cache_cycle_time + memory_cycle_time) * block_size) + (num_cache_misses * cache_cycle_time);
	
		var cache_memory_snapshot = "";
		for (var i = 0; i < no_of_sets; i++) {
			for (var j = 0; j < cache_memory[i].length; j++) {
				console.log("Set Size: " + no_of_sets + "  cache memory length: " + cache_memory[i].length);
				cache_memory_snapshot += "(Set " + i + ", Block " + j + ") <= MM Block: " + cache_memory[i][j].address + "\n";
			}
		}

		var output = {
			num_cache_hits: num_cache_hits,
			num_cache_misses: num_cache_misses,
			miss_penalty: miss_penalty,
			average_memory_access_time: average_memory_access_time,
			total_memory_access_time: total_memory_access_time,
			cache_memory_snapshot: cache_memory_snapshot
		};

		setOutput(output);
	
		// Output results
		// console.log("Cache hits: " + num_cache_hits);
		// console.log("Cache misses: " + num_cache_misses);
		// console.log("Miss penalty: " + miss_penalty);
		// console.log("Total memory access time: " + total_memory_access_time);
		// console.log("Average memory access time: " + average_memory_access_time);
		// console.log(cache_memory_snapshot);
	}

	$("#download").click(function(){
		downloadTxt();
	});

    $("#submit").click(function()
    {
        resetError();
        getInput(input);
        var validInput = true;
        
        if (checkIfEmpty(input))
        {
            var validInput = false;
            document.getElementById("error").innerHTML = "ERROR: Missing inputs";
        }

        if (validInput == true)
        {
			try{
				blockSetAssociativeMRU(input);
			}
            catch(err){
				document.getElementById("error").innerHTML = "ERROR: Invalid input(s)";
			}
            //TODO: algorithm for block set associative - MRU
            // if (MM_size_type == word)
            // {
            //     MM_memory_size = MM_memory_size / block_size;
            // }
            // if (cache_size_type == word)
            // {
            //     cache_size_type = cache_size_type / block_size;
            // }
            //cache = new Array(set_size);
            //for (i = 0; i < set_size; i++)
            //{
            //    cache[i] = [];
            //}
            //sequence = program_flow.split(" ");
        }
    });

    $("#reset").click(function()
    {
        resetError();
        resetInput();
    });
});
