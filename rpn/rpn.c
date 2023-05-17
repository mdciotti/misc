#include <stdio.h>
#include <stdlib.h>
#include <ctype.h>
#include <setjmp.h>

char *pb, *p;
jmp_buf env;

double eval()  {
	double x;  char *q1, *q2;
	if (isspace(*--p))  {
		while (p>pb && isspace(*p))  --p;
		if (p>pb)  switch (*p)  {
				case '+': return eval()+eval();
				case '*': return eval()*eval();
				case '-': return x=eval(),eval()-x;
				case '/': return x=eval(),eval()/x;
	default:  q1 = p+1;
									while (!isspace(*--p))  ;
			if (x=strtod(++p,&q2),q2==q1)  return x;
		}
	}
	longjmp(env,0);
}

int main()  {
	int sz,c,n;
	double x;
	pb = (char*)malloc(sz=4);
	*pb = ' ';
	p = pb+1;
	while ((c=getchar())!=EOF)
		if (c!='\n')  {
			n = p-pb;
			if (n+2==sz)  pb = (char*)realloc(pb,sz*=2);
			p = pb+n;
			*p++ = c;
		}  else  {
			while (--p>pb && isspace(*p))  ;
			if (p++>pb)  {
				*p++ = ' ';
				if (!setjmp(env))  {
					x = eval();
					while (--p>pb && isspace(*p))  ;
					if (p>pb)  longjmp(env,0);
					printf("%f\n",x);
				}
				else  printf("error\n");
				p = pb+1;
			}
		}
	return 0;
}