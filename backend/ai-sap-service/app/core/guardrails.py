import re
import structlog
import uuid

logger = structlog.get_logger()

def extract_numbers_with_context(text: str) -> list:
    # Capture the number and potential magnitude suffix (%, K, M, L, Cr)
    cleaned = re.sub(r',', '', text)
    matches = re.finditer(r'\b(\d+(?:\.\d+)?)\s*([%kKmMlLcCrR]*)', cleaned)
    nums = []
    for m in matches:
        try:
            val = float(m.group(1))
            suffix = m.group(2).strip().lower() if m.group(2) else ""
            nums.append((val, suffix))
        except ValueError:
            pass
    return nums

def extract_numbers_from_dict(d: dict) -> list[float]:
    nums = []
    def traverse(obj):
        if isinstance(obj, (int, float)):
            if not isinstance(obj, bool):
                nums.append(float(obj))
        elif isinstance(obj, dict):
            for v in obj.values():
                traverse(v)
        elif isinstance(obj, list):
            for item in obj:
                traverse(item)
        elif isinstance(obj, str):
            # Attempt to extract raw numbers embedded in string values
            for val, _ in extract_numbers_with_context(obj):
                nums.append(val)
    traverse(d)
    return nums

def validate_numbers(output_text: str, input_data: dict, request_id: str = None) -> tuple[str, list[str]]:
    """
    Extract every numeric token from output_text. For each one, check it appears 
    (within 1% tolerance for rounding) somewhere in input_data's serialized values. 
    If a number in the output has no traceable source, remove the sentence containing it 
    and log a structured warning.
    Returns: (cleaned_text, list_of_untraceable_values)
    """
    if request_id is None:
        request_id = str(uuid.uuid4())
        
    input_nums = extract_numbers_from_dict(input_data)
    
    # Split output_text into sentences
    # Basic split by . ! ? followed by space or end of string
    sentences = re.split(r'(?<=[.!?])(?:\s+|$)', output_text.strip())
    valid_sentences = []
    all_untraceable = []
    
    for sentence in sentences:
        if not sentence.strip(): 
            continue
            
        sentence_nums = extract_numbers_with_context(sentence)
        untraceable = []
        
        for val, suffix in sentence_nums:
            candidates = [val]
            if '%' in suffix:
                candidates.append(val / 100.0)
            if 'k' in suffix:
                candidates.append(val * 1000.0)
            if 'm' in suffix:
                candidates.append(val * 1000000.0)
            if 'l' in suffix: # Lakh
                candidates.append(val * 100000.0)
            if 'cr' in suffix: # Crore
                candidates.append(val * 10000000.0)

            match_found = False
            for c in candidates:
                for v in input_nums:
                    tolerance = 0.01 * max(abs(c), abs(v))
                    if abs(c - v) <= max(tolerance, 0.0001):
                        match_found = True
                        break
                if match_found:
                    break
                    
            if not match_found:
                untraceable.append(f"{val}{suffix}")
        
        if untraceable:
            logger.warning(
                "hallucination_detected",
                request_id=request_id,
                action="strip_sentence",
                untraceable_values=untraceable,
                sentence=sentence,
                input_numbers=input_nums
            )
            all_untraceable.extend(untraceable)
        else:
            valid_sentences.append(sentence.strip())
            
    # Reassemble valid sentences
    return " ".join(valid_sentences), all_untraceable
